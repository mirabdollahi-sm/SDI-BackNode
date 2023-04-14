const fileType = (ext) => {
    return ( ext === 'zip' ) || ( ext === 'rar' ) 
        ? 'zip' 
        : ( ext === 'jpg' ) || ( ext === 'png' ) || ( ext === 'jpeg' ) || ( ext === 'gif' )
        ? 'image'
        : ( ext === 'mp3' ) || ( ext === 'm4a ') || ( ext === 'wav' ) || ( ext === 'wma' )
        ? 'audio'
        : ( ext === 'mp4' ) || ( ext === 'mov' ) || ( ext === 'mkv' ) || ( ext === 'wmv' ) 
        ? 'video'
        : ( ext === 'pdf' )
        ? 'pdf'
        : ( ext === 'txt' )
        ? 'text'
        : ( ext === 'docx' )
        ? 'word'
        : ( ext === 'xlsx' )
        ? 'excel'
        : ( ext === 'pptx' )
        ? 'powerpoint'
        : ( ext === 'html' )
        ? 'html'
        : 'other'
}
module.exports = fileType