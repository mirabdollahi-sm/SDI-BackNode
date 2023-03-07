const fs = require('fs');
const path = require('path');

const read = async (req, res) => {
    let target = '../' + req.params.dir;
    target = target.replaceAll('_', '/');
    const ext = path.extname(target)
    if (!fs.existsSync(target)) {
        return res.status(204).json({ 'messege' : 'No such file or directory!' })
    }
    if (!ext) {
        const children = fs.readdirSync(target);
        let readme = false;
        for ( let i = children.length - 1 ; i >= 0; i-- ) {
            if ( children[i].indexOf('Readme') !== -1 ) {
                children.splice(i, 1)
                readme = true;  
            }
        }
        const name = path.basename(target);
        const par = path.dirname(target);
        return res.json({ 
            name,
            par,
            children,
            readme
        });
    }
    var stat = fs.statSync(target);
    console.log(`attachment;filename=${target.split('/').pop()}`);
    res.writeHead(200, {
            'Content-Disposition': `attachment;filename=${target.split('/').pop()}`,
            'Content-Type': 'application/octet-stream',
            'Content-Length': stat.size
    });
    var readStream = fs.createReadStream(target);
    readStream.pipe(res);
}       

module.exports = {
    read
}