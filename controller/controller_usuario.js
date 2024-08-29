// Import do arquivo responsavel pela interação com DB(model)
const { application } = require('express')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const usuarioDAO = require('../model/DAO/usuario')
// Import do arquivo de configuração do projeto
const message = require('../modulo/config.js')
const { join } = require('@prisma/client/runtime/library.js')
const { json } = require('body-parser')

const setInserirUsuario = async function(dadosUsuario, contentType){
    try{

        
        // validação para aplicação do contentType
        if(String(contentType).toLowerCase() == 'application/json'){
            
            // cria o objeto JSON para devolver os dados criados na requisição
            let novoUsuarioJSON = {};            
        
            // validação de campos obrigatorios ou com digitação inválida
            if(dadosUsuario.nome == ''    || dadosUsuario.nome == undefined       ||  dadosUsuario.nome == null               || dadosUsuario.nome.length > 255 ||
               dadosUsuario.email == ''  ||   dadosUsuario.email == undefined  || dadosUsuario.email == null   || dadosUsuario.email.length > 255 ||
               dadosUsuario.cpf == '' ||  dadosUsuario.cpf == undefined || dadosUsuario.cpf == null  || dadosUsuario.cpf.length > 15 ||
               dadosUsuario.sexo == '' ||  dadosUsuario.sexo == undefined || dadosUsuario.sexo == null  || dadosUsuario.sexo.length > 20 ||
               dadosUsuario.senha == '' ||  dadosUsuario.senha == undefined || dadosUsuario.senha == null  || dadosUsuario.senha.length > 255
            ){

                
                // return do status code 400
                return message.ERROR_REQUIRED_FIELDS
                
            } else {
                // console.log(dadosClassificacao)
        
                // Gera o hash da senha
                const hashedPassword = await bcrypt.hash(dadosUsuario.senha, saltRounds);
                
                // Atualiza dadosEnderecocom a senha hash
                dadosUsuario.senha = hashedPassword;
        
             
             
        
                // Encaminha os dados do filme para o DAO inserir dados
                let novoUsuario = await usuarioDAO.insertUsuario(dadosUsuario);
                
                // validação para verificar se o DAO inseriu os dados do BD
                if (novoUsuario)
                {
        
                    let ultimoId = await usuarioDAO.idUsuario()
                    dadosUsuario.id = ultimoId[0].id
                
                    // se inseriu cria o JSON dos dados (201)
                    novoUsuarioJSON.usuario  = dadosUsuario
                    novoUsuarioJSON.status = message.SUCCESS_CREATED_ITEM.status
                    novoUsuarioJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    novoUsuarioJSON.message = message.SUCCESS_CREATED_ITEM.message 
        
                    return novoUsuarioJSON; // 201
                }else{
                 
                    return message.ERROR_INTERNAL_SERVER_DB // 500
                    }
                  
              }
            } else {
                return message.ERROR_CONTENT_TYPE // 415
            }
        } catch(error){
            console.log(error);
            return message.ERROR_INTERNAL_SERVER // 500
        }
}

const setAtualizarUsuario = async function(id, dadoAtualizado, contentType){
    try{

        let idUsuario = id

        // console.log(dadoAtualizado);
        // Validação de content-type (apenas aplication/json)
        if(String(contentType).toLowerCase() == 'application/json'){
            let dadosID = usuarioDAO.selectUsuarioById(idUsuario)

            
            if(idUsuario == '' || idUsuario == undefined || idUsuario == isNaN(idUsuario) || idUsuario == null){
                return message.ERROR_INVALID_ID
                
            }else if(idUsuario>dadosID.length){
                return message.ERROR_NOT_FOUND
            }else{
                // Cria o objeto JSON para devolver os dados criados na requisição
                let atualizarUsuarioJSON = {}
                // console.log(idClassificacao);
                // console.log(dadoAtualizado);
                    //Validação de campos obrigatórios ou com digitação inválida
                    if(dadoAtualizado.nome == ''    || dadoAtualizado.nome == undefined       ||  dadoAtualizado.nome == null               || dadoAtualizado.nome.length > 255 ||
                    dadoAtualizado.email == ''  ||   dadoAtualizado.email == undefined  || dadoAtualizado.email == null   || dadoAtualizado.email.length > 255 ||
                    dadoAtualizado.cpf == '' ||  dadoAtualizado.cpf == undefined || dadoAtualizado.cpf == null  || dadoAtualizado.cpf.length > 15 ||   
                    dadoAtualizado.sexo == '' ||  dadoAtualizado.sexo == undefined || dadoAtualizado.sexo == null  || dadoAtualizado.sexo.length > 20 ||
                    dadoAtualizado.senha == '' ||  dadoAtualizado.senha == undefined || dadoAtualizado.senha == null  || dadoAtualizado.senha.length > 255        
                    ){
                        return message.ERROR_REQUIRED_FIELDS
                    }
                
                    else{

                        if (dadoAtualizado.senha) {
                            dadoAtualizado.senha = await bcrypt.hash(dadoAtualizado.senha, saltRounds);
                        }
                        
                            // Encaminha os dados do filme para o DAO inserir no DB
                            let dadosEndereco= await usuarioDAO.updateUsuario(dadoAtualizado, idUsuario)
                
                            // Validação para verificar se o DAO inseriu os dados do DB
                        
                            if(dadosUsuario){
                    
                                //Cria o JSON de retorno dos dados (201)
                                atualizarUsuarioJSON.usuario      = dadosUsuario
                                atualizarUsuarioJSON.status      = message.SUCCESS_UPDATED_ITEM.status
                                atualizarUsuarioJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                                atualizarUsuarioJSON.message     = message.SUCCESS_UPDATED_ITEM.message
                                return atualizarUsuarioJSON //201
                                
                            }else{
                                return message.ERROR_INTERNAL_SERVER_DB //500
                            }
                        
                
                    }
                    
                }
            }else{
                return message.ERROR_CONTENT_TYPE //415
            }


        }catch(error){
            console.log(error)
        return message.ERROR_INTERNAL_SERVER //500 - erro na controller
    }
}

const setDeletarUsuario = async function(id){
    try {
        let idUsuario = id
    
        if(idUsuario == '' || idUsuario == undefined || idUsuario == isNaN(idUsuario) || idUsuario == null){
            return message.ERROR_INVALID_ID
        }else{        

            let dadosEndereco= await usuarioDAO.deleteUsuario(idUsuario)
    
        
            if(dadosUsuario){
              return  message.SUCCESS_DELETED_ITEM
            }else{
                return message.ERROR_NOT_FOUND
            }
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER
    }
}

const setListarUsuario = async function(){
    try {
        let usuarioJSON = {}

   let dadosEndereco= await usuarioDAO.selectAllUsuario()
   {
    if(dadosUsuario){

        if(dadosUsuario.length> 0){
            usuarioJSON.usuarios = dadosUsuario
            usuarioJSON.quantidade = dadosUsuario.length
            usuarioJSON.status_code = 200
            return usuarioJSON
        }else{
            return message.ERROR_NOT_FOUND
        }
    }else{
        return message.ERROR_INTERNAL_SERVER_DB
    }

    } 
    }
    catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER
}
}

const setListarUsuarioById = async function(id){
    try {
        // Recebe o id do filme
     
    let idUsuario = id

    //Cria o objeto JSON
    let usuarioJSON = {}


    //Validação para verificar se o id é válido(Vazio, indefinido e não numérico)
    if(idUsuario == '' || idUsuario == undefined || isNaN(idUsuario)){
        return message.ERROR_INVALID_ID // 400
    }else{

        //Encaminha para o DAO localizar o id do filme 
        let dadosEndereco= await usuarioDAO.selectUsuarioById(idUsuario)

        // Validação para verificar se existem dados de retorno
        if(dadosUsuario){

            // Validação para verificar a quantidade de itens encontrados.
            if(dadosUsuario.length > 0){
                //Criar o JSON de retorno
                usuarioJSON.usuario = dadosUsuario
                usuarioJSON.status_code = 200
    
                
                return usuarioJSON
            }else{
                return message.ERROR_NOT_FOUND // 404
            }

        }else{
            return message.ERROR_INTERNAL_SERVER_DB // 500
        }
    }
   } catch (error) {
       console.log(error)
       return message.ERROR_INTERNAL_SERVER_DB
   }
}

module.exports = {
    setInserirUsuario,
    setAtualizarUsuario,
    setDeletarUsuario,
    setListarUsuario,
    setListarUsuarioById
}