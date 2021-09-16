const db = require('./database');
const express = require('express');
const app = express();
const path = require('path')
const getRandom = (ext) => {return `${Math.floor(Math.random() * 10000)}${ext}`}
const myhost = (req) => {
    return `http://${req.headers.host}` 
}
const porta = process.env.PORT || 3000

//console.log("criando tabela usuarios")
//db.query('CREATE TABLE "links" ("url_base" TEXT NOT NULL,"id_url_curta" TEXT NOT NULL UNIQUE);')

app.set('json spaces', 4)
app.use(express.json())
app.listen(porta, function(){
    console.log("escutando na porta ", porta)
});

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '/index.html'))
})


app.post('/insert', async function(req, res){

    url = req.body.url ? inserir(req.body.url) : res.json({"sucess": false, "result": 'url vazia'})
    
    async function inserir(url){
        try {
            checa_id = await db.query(`select "id_url_curta" from links where id_url_curta=$1`, [url.id_url_curta])
            linhas =  await checa_id.rowCount
            if(linhas>0) {
                res.json({"sucess": false, "result": 'id ja existe'})
                return
            }

            makeinsert = await db.query("INSERT INTO links VALUES ($1, $2);", [url.url_base, url.id_url_curta])
            makecommit = await db.query('commit;')
            res.json({"sucess" : true, "result": `${myhost(req)}/${url.id_url_curta}`})
        } catch (error) {
            console.log(error)
            res.json({"sucess": false, "result": error.message})
        }
    }
    
})

app.get('/:id', async function(req, res){
    id = req.params.id
    try {
        checa_id = await db.query(`select * from links where id_url_curta=$1`, [id])
        linhas =  await checa_id.rowCount
        if(linhas>0) {
            console.log('redirecionando', id)
            url = checa_id.rows[0].url_base
            url = url.includes('http') ? url : ('http://'+url)
            res.status(301).redirect(url)
            return
        }else{
            res.send('url não encontrada')
        }

    } catch (error) {
        console.log(error)
        res.json({"sucess": false, "result": error.message})
    }
})
