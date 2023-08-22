//FILE DATABASE QUERIES
const deleteFilesDatabase = () => {
  return ` DELETE FROM sql_sdi.files`;
};

const insertFile = (
  file_id,
  parent_id,
  file_name,
  file_type,
  file_size
) => {
  const query = `
    INSERT INTO sql_sdi.files (
      file_id,
      parent_id,
      file_name,
      file_type,
      file_size
    )
    VALUES (
      ${file_id},
      ${parent_id},
      '${file_name}',
      '${file_type}',
      
      '${file_size}'
    );  
    `;
  return query;
};

const selectFileById = (id) => {
  const query = `
    SELECT * FROM sql_sdi.files
    WHERE file_id = '${id}'
    `;
  return query;
};

const listChildren = (id) => {
  const query = `
    SELECT * FROM sql_sdi.files
    WHERE parent_id = '${id}'
    ORDER BY file_type
    `;
  return query;
};

module.exports = {
  deleteFilesDatabase,
  insertFile,
  selectFileById,
  listChildren,
};
