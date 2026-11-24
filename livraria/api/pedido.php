<?php
require_once __DIR__ . '/../includes/bootstrap.php';
$usuario = api_exigir_login();
$in = api_entrada();

// Espera: { "itens": [ { "id": 1, "qtd": 2 }, ... ] }
// O preço NUNCA vem do navegador: é lido do banco.
$brutos = $in['itens'] ?? [];
if (!is_array($brutos) || !$brutos) {
    json_resposta(['ok' => false, 'erro' => 'Carrinho vazio.'], 422);
}

$pedidos = []; // livro_id => quantidade (soma duplicados)
foreach ($brutos as $it) {
    $id  = (int) ($it['id'] ?? 0);
    $qtd = (int) ($it['qtd'] ?? 0);
    if ($id <= 0 || $qtd <= 0 || $qtd > 99) {
        json_resposta(['ok' => false, 'erro' => 'Item inválido no carrinho.'], 422);
    }
    $pedidos[$id] = ($pedidos[$id] ?? 0) + $qtd;
}

$pdo = db();
try {
    $pdo->beginTransaction();

    $marcas = implode(',', array_fill(0, count($pedidos), '?'));
    $st = $pdo->prepare("SELECT id, titulo, preco, estoque FROM livros WHERE ativo = 1 AND id IN ($marcas) FOR UPDATE");
    $st->execute(array_keys($pedidos));
    $livros = [];
    foreach ($st->fetchAll() as $l) {
        $livros[(int) $l['id']] = $l;
    }

    $total = 0.0;
    foreach ($pedidos as $id => $qtd) {
        if (!isset($livros[$id])) {
            throw new RuntimeException('Um dos livros não está mais disponível.');
        }
        if ($qtd > (int) $livros[$id]['estoque']) {
            throw new RuntimeException('Estoque insuficiente para "' . $livros[$id]['titulo'] . '".');
        }
        $total += (float) $livros[$id]['preco'] * $qtd;
    }

    $pdo->prepare('INSERT INTO pedidos (usuario_id, total) VALUES (?, ?)')
        ->execute([$usuario['id'], round($total, 2)]);
    $pedidoId = (int) $pdo->lastInsertId();

    $insItem = $pdo->prepare('INSERT INTO itens_pedido (pedido_id, livro_id, quantidade, preco_unit) VALUES (?, ?, ?, ?)');
    $baixa   = $pdo->prepare('UPDATE livros SET estoque = estoque - ? WHERE id = ?');
    foreach ($pedidos as $id => $qtd) {
        $insItem->execute([$pedidoId, $id, $qtd, $livros[$id]['preco']]);
        $baixa->execute([$qtd, $id]);
    }

    $pdo->commit();
    json_resposta(['ok' => true, 'pedido' => $pedidoId, 'total' => round($total, 2)], 201);
} catch (RuntimeException $ex) {
    $pdo->rollBack();
    json_resposta(['ok' => false, 'erro' => $ex->getMessage()], 409);
} catch (Throwable $ex) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    error_log($ex->getMessage());
    json_resposta(['ok' => false, 'erro' => 'Não foi possível concluir o pedido.'], 500);
}
