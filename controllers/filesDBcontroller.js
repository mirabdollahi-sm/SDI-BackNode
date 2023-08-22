const fs = require("fs");
const pool = require("../config/dbConn");
const fileType = require("../functions/fileType");
const queries = require("./queries/fileQueries");

const fileDBCreator = async (req, res) => {
  let id = 1;
  pool.query(queries.deleteFilesDatabase(), (err) => {
    if (err) console.log(err);
  });
  const fileDBWriter = async (path, parent_id) => {
    const file_id = id;
    id++;
    const file_name = path;
    const ext = path.split(".").pop();
    const file_stat = fs.statSync(path);
    const file_size = file_stat.size;
    const file_type = file_stat.mode === 16822 ? "1-folder" : fileType(ext);
    pool.query(
      queries.insertFile(file_id, parent_id, file_name, file_type, file_size),
      (err) => {
        if (err) console.log(err);
      }
    );
    if (file_type.search("folder") !== -1) {
      const children = fs.readdirSync(path);
      for (child of children) {
        fileDBWriter(path + "/" + child, file_id);
      }
    }
  };
  await fileDBWriter("../root", 0);
  console.log("hiii");
  return res.status(201).json({ message: "DB has been refreshed!" });
};

module.exports = fileDBCreator;
