const fs = require("fs");
const path = require("path");
const { b64DecodeUnicode } = require("../functions/urlDecode.js");
const pool = require("../config/dbConn");
const queries = require("./queries/fileQueries");

const read = async (req, res) => {
  let target = b64DecodeUnicode(req.params.dir);
  pool.query(queries.selectFileById(target), (err, queryRes) => {
    if (err) console.log(err);
    if (!queryRes.length)
      return res.status(204).json({ messege: "No such file or directory!" });
    const name = queryRes[0].file_name;
    const parent_id = queryRes[0].parent_id;
    if (queryRes[0].file_type.search("folder") !== -1) {
      pool.query(queries.listChildren(target), (err, queryRes) => {
        let readMe = false;
        if (err) console.log(err);
        const children = queryRes.filter((child) => {
          if (child.file_name.search("Readme") === -1) {
            return child;
          } else {
            readMe = child.file_id;
          }
        });
        return res.json({
          name,
          parent_id,
          children,
          readMe,
        });
      });
    } else {
      const fileName = path.basename(name);
      const contentType =
        fileName === "Readme.html" ? "text/html" : "application/octet-stream";
      res.writeHead(200, {
        "Content-Disposition": `attachment;filename=${fileName}`,
        "Content-Type": `${contentType}`,
        "Content-Length": queryRes[0].file_size,
      });
      const readStream = fs.createReadStream(queryRes[0].file_name);
      readStream.pipe(res);
    }
  });
};

module.exports = {
  read,
};
