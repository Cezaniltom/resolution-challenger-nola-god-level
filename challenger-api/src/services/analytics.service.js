const { prisma, Prisma } = require('../lib/prisma');

// Overview
async function getOverview({ startDate, endDate }) {
    const filters = [Prisma.sql`sale_status_desc <> 'CANCELLED'`];
    if (startDate) {
        filters.push(Prisma.sql`created_at >= ${new Date(startDate)}`);
    }
    if (endDate) {
        filters.push(Prisma.sql`created_at <= ${new Date(endDate)}`);
    }
    const whereClause = Prisma.join(filters, ' AND ');

    return prisma.$queryRaw`
        SELECT 
        SUM(total_amount) AS faturamento_total,
        COUNT(id) AS total_pedidos,
        AVG(total_amount) AS ticket_medio
        FROM sales
        WHERE ${whereClause};
    `;
}

// Faturamento por Canal
async function getFaturamentoPorCanal({ startDate, endDate }) {
    const filters = [Prisma.sql`s.sale_status_desc <> 'CANCELLED'`];
    if (startDate) {
        filters.push(Prisma.sql`s.created_at >= ${new Date(startDate)}`);
    }
    if (endDate) {
        filters.push(Prisma.sql`s.created_at <= ${new Date(endDate)}`);
    }
    const whereClause = Prisma.join(filters, ' AND ');

    return prisma.$queryRaw`
        SELECT 
        c.name AS canal_nome,
        SUM(s.total_amount) AS faturamento_total,
        COUNT(s.id) AS total_pedidos,
        AVG(s.total_amount) AS ticket_medio
        FROM sales s
        JOIN channels c ON s.channel_id = c.id
        WHERE ${whereClause}
        GROUP BY c.name
        ORDER BY faturamento_total DESC;
    `;
}

// Faturamento por Loja
async function getFaturamentoPorLoja({ startDate, endDate }) {
    const filters = [Prisma.sql`s.sale_status_desc <> 'CANCELLED'`];
    if (startDate) {
        filters.push(Prisma.sql`s.created_at >= ${new Date(startDate)}`);
    }
    if (endDate) {
        filters.push(Prisma.sql`s.created_at <= ${new Date(endDate)}`);
    }
    const whereClause = Prisma.join(filters, ' AND ');

    return prisma.$queryRaw`
        SELECT 
        st.name AS loja_nome,
        SUM(s.total_amount) AS faturamento_total,
        COUNT(s.id) AS total_pedidos,
        AVG(s.total_amount) AS ticket_medio
        FROM sales s
        JOIN stores st ON s.store_id = st.id
        WHERE ${whereClause}
        GROUP BY st.name
        ORDER BY faturamento_total DESC;
    `;
}

// Filtro Top Produtos
async function getTopProductsFiltrado(filters) {
    const { channel, dayOfWeek, startDate, endDate, limit = 10 } = filters;
    const limitNum = parseInt(limit);
    const whereClauses = [Prisma.sql`s.sale_status_desc <> 'CANCELLED'`];

    if (channel) {
        whereClauses.push(Prisma.sql`c.name = ${channel}`);
    }
    if (dayOfWeek) {
        whereClauses.push(Prisma.sql`EXTRACT(ISODOW FROM s.created_at) = ${parseInt(dayOfWeek)}`);
    }
    if (startDate) {
        whereClauses.push(Prisma.sql`s.created_at >= ${new Date(startDate)}`);
    }
    if (endDate) {
        const inclusiveEndDate = new Date(endDate);
        inclusiveEndDate.setDate(inclusiveEndDate.getDate() + 1);
        whereClauses.push(Prisma.sql`s.created_at < ${inclusiveEndDate}`);
    }
    
    const where = Prisma.join(whereClauses, ' AND ');

    return prisma.$queryRaw`
        SELECT 
        p.name AS produto_nome,
        SUM(ps.quantity) AS total_vendido
        FROM products p
        JOIN product_sales ps ON p.id = ps.product_id
        JOIN sales s ON ps.sale_id = s.id
        JOIN channels c ON s.channel_id = c.id
        WHERE ${where}
        GROUP BY p.id, p.name
        ORDER BY total_vendido DESC
        LIMIT ${limitNum};
    `;
}

// Performance de Entrega
async function getDeliveryPerformance({ groupBy = 'hour' }) {
    const groupingSql = groupBy === 'day' 
        ? Prisma.sql`EXTRACT(ISODOW FROM created_at)` 
        : Prisma.sql`EXTRACT(HOUR FROM created_at)`;

    return prisma.$queryRaw`
        SELECT 
        ${groupingSql} AS grupo,
        AVG(delivery_seconds) AS tempo_medio_segundos,
        COUNT(id) AS total_entregas
        FROM sales
        WHERE 
        delivery_seconds IS NOT NULL 
        AND sale_status_desc <> 'CANCELLED'
        GROUP BY grupo
        ORDER BY grupo ASC;
    `;
}

//  Clientes que compraram 3+ e não retornaram em 30+ dias
// src/services/analytics.service.js (NO SEU BACKEND)

// src/services/analytics.service.js (NO SEU BACKEND)

async function getCustomersChurnRisk(filters) {
    // 1. Lê os novos filtros de paginação e ordenação
    const { 
      frequency = 3, 
      recencyDays = 30, 
      page = 1, 
      limit = 10, // Define um limite de 10 por página
      sortKey = 'ultima_compra_data',
      sortDirection = 'asc'
    } = filters;

    const freqNum = parseInt(frequency);
    const recencyNum = parseInt(recencyDays);
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum; // Calcula o "pulo"

    // 2. Mapeia as chaves de ordenação com segurança
    const sortKeyMap = {
      'customer_name': Prisma.sql`c.customer_name`,
      'frequencia': Prisma.sql`cs.frequencia`,
      'ultima_compra_data': Prisma.sql`cs.ultima_compra_data`
    };
    const orderByClause = sortKeyMap[sortKey] || Prisma.sql`cs.ultima_compra_data`;
    const directionClause = sortDirection.toLowerCase() === 'desc' ? Prisma.sql`DESC` : Prisma.sql`ASC`;

    // 3. Query para os dados paginados (com ORDER BY, LIMIT, OFFSET)
    const customers = await prisma.$queryRaw`
        WITH CustomerStats AS (
            SELECT
                customer_id,
                COUNT(id) AS frequencia,
                MAX(created_at::date) AS ultima_compra_data
            FROM sales
            WHERE customer_id IS NOT NULL AND sale_status_desc <> 'CANCELLED'
            GROUP BY customer_id
        )
        SELECT
            c.customer_name,
            c.phone_number,
            c.email,
            cs.frequencia,
            cs.ultima_compra_data
        FROM CustomerStats cs
        JOIN customers c ON cs.customer_id = c.id
        WHERE
            cs.frequencia >= ${freqNum}
            AND cs.ultima_compra_data <= (CURRENT_DATE - CAST(${recencyNum} AS INT))
        ORDER BY
            ${orderByClause} ${directionClause}
        LIMIT ${limitNum}
        OFFSET ${offset};
    `;

    // 4. Query SEPARADA para a contagem total (para a paginação)
    const totalResult = await prisma.$queryRaw`
        WITH CustomerStats AS (
            SELECT
                customer_id,
                COUNT(id) AS frequencia,
                MAX(created_at::date) AS ultima_compra_data
            FROM sales
            WHERE customer_id IS NOT NULL AND sale_status_desc <> 'CANCELLED'
            GROUP BY customer_id
        )
        SELECT COUNT(*)
        FROM CustomerStats cs
        WHERE
            cs.frequencia >= ${freqNum}
            AND cs.ultima_compra_data <= (CURRENT_DATE - CAST(${recencyNum} AS INT));
    `;

    const totalCount = parseInt(totalResult[0].count);

    // 5. Retorna um OBJETO, não mais um array
    return {
        customers: customers.map(c => ({
            ...c,
            frequencia: c.frequencia.toString() 
        })),
        totalCount: totalCount,
        totalPages: Math.ceil(totalCount / limitNum)
    };
}

// Produtos para Repensar preço
async function getProductsByMarginProxy({ limit = 20 }) {
    const limitNum = parseInt(limit);

    return prisma.$queryRaw`
        SELECT
        p.name AS produto_nome,
        p.id AS product_id,
        AVG(ps.base_price) as preco_base_medio,
        AVG(ps.total_price) as preco_vendido_medio,
        AVG(ps.total_price / NULLIF(ps.base_price, 0)) * 100 AS percentual_preco_base
        FROM product_sales ps
        JOIN products p ON ps.product_id = p.id
        WHERE 
        ps.base_price > 0
        GROUP BY p.id, p.name
        ORDER BY
        percentual_preco_base ASC
        LIMIT ${limitNum};
    `;
}


// Exporta todas as funções
module.exports = {
    getOverview,
    getFaturamentoPorCanal,
    getFaturamentoPorLoja,
    getTopProductsFiltrado,
    getDeliveryPerformance,
    getCustomersChurnRisk,
    getProductsByMarginProxy,
};