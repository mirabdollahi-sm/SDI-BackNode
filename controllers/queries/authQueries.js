const selectByUsername = (user) => {
  const query = `
    SELECT * FROM sql_sdi.users
    WHERE username = '${user}'
  `;
  return query;
};

const selectByRefreshToken = (refreshToken) => {
  const query = `
    SELECT * FROM sql_sdi.users
    WHERE refresh_token = '${refreshToken}'
  `;
  return query;
};

const updateRefreshToken = (refreshToken, user) => {
  const query = `
    UPDATE sql_sdi.users
    SET
      refresh_token = '${refreshToken}'
    WHERE username = '${user}'
  `;
  return query;
};

const deleteRefreshToken = (refreshToken) => {
  const query = `
    UPDATE sql_sdi.users
    SET
      refresh_token = NULL
    WHERE refresh_token = '${refreshToken}'
  `;
  return query;
};

module.exports = {
  selectByUsername,
  selectByRefreshToken,
  updateRefreshToken,
  deleteRefreshToken,
};
