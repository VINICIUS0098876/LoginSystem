/**** 
Para realizar a integração com o banco de dados devemos utilizar uma das seguinte bibliotecas:
 -> SEQUELIZE - É a biblioteca mais antiga
 -> PRISMA ORM - É a biblioteca mais atual (Utilizaremos no projeto)
 -> FASTFY ORM - É a biblioteca mais atual
*****************************************
Para instalação do PRISMA ORM: 
 -> npm install prisma --save - (É responsavel pela conexão com o Banco de dados)
 -> npm install @prisma/client --save - (É responsavel por executar scripts SQL no Banco de dados)
 
Para iniciar o prisma no projeto, devemos:
 -> npx prisma init
*****/

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

app.use((request, response, next) =>{

    // Permite especificar quem podera acessar a API ('*' = Liberar acesso público, 'IP' = Liberar acesso apenas para aquela maquina);
    response.header('Access-Control-Allow-Origin', '*')

    // Permite especificar como a API, sera requisitada ('GET', 'POST', 'PUT' e 'DELETE')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    // Ativa as confgurações de cors
    app.use(cors())


    next()
})

const bodyParserJSON = bodyParser.json()

/*********************** Import dos arquivos de controller do projeto ***********************************/
    const controllerUsuario = require('./controller/controller_usuario.js')
    const controllerEndereco = require('./controller/controller_endereco.js')

/*********************** USUARIO ***********************************/
    app.post('/v1/loginSystem/usuario', cors(), bodyParserJSON, async function (request, response,next ){

        // recebe o ContentType com os tipos de dados encaminhados na requisição
        let contentType = request.headers['content-type'];
    
        // vou receber o que chegar no corpo da requisição e guardar nessa variável local
        let dadosBody = request.body;
        // encaminha os dados para a controller enviar para o DAO
        let resultDadosNovoUsuario = await controllerUsuario.setInserirUsuario(dadosBody, contentType)
    
    
        response.status(resultDadosNovoUsuario.status_code);
        response.json(resultDadosNovoUsuario);
    
    })

    app.delete('/v1/loginSystem/usuario/:id', cors (), async function (request,response,next){

        let idUsuario = request.params.id
    
        let dadosUsuario= await controllerUsuario.setDeletarUsuario(idUsuario);
    
        response.status(dadosUsuario.status_code);
        response.json(dadosUsuario)
    })

    app.get('/v1/loginSystem/usuario', cors(),async function (request,response,next){

        // chama a função da controller para retornar os filmes;
        let dadosUsuario= await controllerUsuario.setListarUsuario();
    
        // validação para retornar o Json dos filmes ou retornar o erro 404;
        if(dadosUsuario){
            response.json(dadosUsuario);
            response.status(dadosUsuario.status_code);
        }else{
            response.json({message: 'Nenhum registro foi encontrado'});
            response.status(404);
        }
    });

    app.get('/v1/loginSystem/usuario/:id', cors(), async function(request,response,next){

        // recebe o id da requisição
        let idUsuario = request.params.id
    
        //encaminha o id para a acontroller buscar o filme
        let dadosUsuario= await controllerUsuario.setListarUsuarioById(idUsuario)
    
        response.status(dadosUsuario.status_code);
        response.json(dadosUsuario);
    })

    app.put('/v1/loginSystem/usuarioAtualizar/:id', cors(), bodyParserJSON, async function(request,response,next){

        let idUsuario = request.params.id
        let contentType = request.headers['content-type'];
        let dadosBody = request.body
    
        let resultUptadeUsuario = await controllerUsuario.setAtualizarUsuario(idUsuario, dadosBody, contentType)
    
        response.status(resultUptadeUsuario.status_code)
        response.json(resultUptadeUsuario)
    
    })

    /*********************** ENDEREÇO ***********************************/
    app.post('/v1/loginSystem/endereco', cors(), bodyParserJSON, async function (request, response,next ){

        // recebe o ContentType com os tipos de dados encaminhados na requisição
        let contentType = request.headers['content-type'];
    
        // vou receber o que chegar no corpo da requisição e guardar nessa variável local
        let dadosBody = request.body;
        // encaminha os dados para a controller enviar para o DAO
        let resultDadosNovoEndereco = await controllerEndereco.setInserirEndereco(dadosBody, contentType)
    
    
        response.status(resultDadosNovoEndereco.status_code);
        response.json(resultDadosNovoEndereco);
    
    })

    app.put('/v1/loginSystem/enderecoAtualizar/:id', cors(), bodyParserJSON, async function(request,response,next){

        let idEndereco = request.params.id
        let contentType = request.headers['content-type'];
        let dadosBody = request.body
    
        let resultUptadeEndereco = await controllerEndereco.setAtualizarEndereco(idEndereco, dadosBody, contentType)
    
        response.status(resultUptadeEndereco.status_code)
        response.json(resultUptadeEndereco)
    
    })

    app.listen('8080', function(){
        console.log('API funcionando!!')
    })