const selectAllUsers = () => {
  const query = `
    SELECT * FROM sql_sdi.users
  `;
  return query;
};

const addUser = (user, hashedPwd, role) => {
  const query = `
    INSERT INTO sql_sdi.users (
      username,
      password,
      role
    )
    VALUES (
      '${user}',
      '${hashedPwd}',
      '${role}'
    );
  `;
  return query;
};

const updateUser = (newUsername, hashedPwd, role, id) => {
  const query = `
    UPDATE sql_sdi.users
    SET
      username = '${newUsername}',
      password = '${hashedPwd}',
      role = '${role}'
    WHERE user_id = ${id};
  `;
  return query;
};

const deleteUser = (id) => {
  const query = `
    DELETE FROM sql_sdi.users
    WHERE user_id = ${id};
  `;
  return query;
};

const selectById = (id) => {
  const query = `
    SELECT * FROM sql_sdi.users
    WHERE user_id = ${id}
  `;
  return query;
};

module.exports = {
  selectAllUsers,
  addUser,
  updateUser,
  deleteUser,
  selectById,
};
