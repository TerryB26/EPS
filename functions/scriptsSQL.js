export const sanitizeAndClean = (data) => {
    const sanitizedData = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        sanitizedData[key] = data[key].toString().replace(/[^a-zA-Z0-9 ]/g, '');
      }
    }
    return sanitizedData;
  };
  
  export const sqlInsert = (table, data) => {
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data).map(value => `'${value}'`).join(', ');
    return `INSERT INTO ${table} (${columns}) VALUES (${values});`;
  };
  
  export const sqlUpdateFieldWhere = (table, data, whereClause) => {
    const updates = Object.entries(data).map(([key, value]) => `${key} = '${value}'`).join(', ');
    return `UPDATE ${table} SET ${updates} ${whereClause};`;
  };
  
  export const sqlDeleteWhere = (table, whereClause) => {
    return `DELETE FROM ${table} ${whereClause};`;
  };
  
  export const wrapWithTransaction = (action, query) => {
    return `
      BEGIN TRANSACTION ${action};
      ${query}
      COMMIT TRANSACTION ${action};
    `;
  };
  
  import { Client } from 'pg';
  
  export const executeOutputResultRet = async (dbConfig, query) => {
    const client = new Client(dbConfig);
    await client.connect();
    try {
      const res = await client.query(query);
      return res;
    } finally {
      await client.end();
    }
  };