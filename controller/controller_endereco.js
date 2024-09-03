// Import do arquivo responsavel pela interação com DB(model)
const { application } = require('express')
const enderecoDAO = require('../model/DAO/endereco.js')
const usuarioDAO = require('../model/DAO/usuario.js')
// Import do arquivo de configuração do projeto
const message = require('../modulo/config.js')
const { join } = require('@prisma/client/runtime/library.js')
const { json } = require('body-parser')

const setInserirEndereco = async function(dadosEndereco, contentType){
    try{

        console.log(dadosEndereco.id_usuario)
        // validação para aplicação do contentType
        if(String(contentType).toLowerCase() == 'application/json'){
            
            // cria o objeto JSON para devolver os dados criados na requisição
            let novoEnderecoJSON = {};            
        
            // validação de campos obrigatorios ou com digitação inválida
            if(dadosEndereco.cep == ''    || dadosEndereco.cep == undefined       ||  dadosEndereco.cep == null               || dadosEndereco.cep.length > 20 ||
               dadosEndereco.logradouro == ''  ||   dadosEndereco.logradouro == undefined  || dadosEndereco.logradouro == null   || dadosEndereco.logradouro.length > 255 ||
               dadosEndereco.cidade == '' ||  dadosEndereco.cidade == undefined || dadosEndereco.cidade == null  || dadosEndereco.cidade.length > 150 ||
               dadosEndereco.numero == '' ||  dadosEndereco.numero == undefined || dadosEndereco.numero == null  || dadosEndereco.numero.length > 30 
            ){

                
                // return do status code 400
                return message.ERROR_REQUIRED_FIELDS
                
            } else {
               
                // Encaminha os dados do filme para o DAO inserir dados
                let ultimoID= await usuarioDAO.idUsuario()
                    dadosEndereco.id_usuario=ultimoID[0].id_usuario
                    console.log(ultimoID);
                    
                    let novoEndereco = await enderecoDAO.insertEndereco(dadosEndereco);

                
                // validação para verificar se o DAO inseriu os dados do BD
                if (novoEndereco)
                {
                    
                
                    // se inseriu cria o JSON dos dados (201)
                    novoEnderecoJSON.endereco  = dadosEndereco
                    novoEnderecoJSON.status = message.SUCCESS_CREATED_ITEM.status
                    novoEnderecoJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    novoEnderecoJSON.message = message.SUCCESS_CREATED_ITEM.message 
        
                    return novoEnderecoJSON; // 201
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

const setAtualizarEndereco = async function(id, dadoAtualizado, contentType){
    try{

        let idEndereco = id

        // console.log(dadoAtualizado);
        // Validação de content-type (apenas aplication/json)
        if(String(contentType).toLowerCase() == 'application/json'){
            let dadosID = enderecoDAO.selectEnderecoByid(idEndereco)

            
            if(idEndereco == '' || idEndereco == undefined || idEndereco == isNaN(idEndereco) || idEndereco == null){
                return message.ERROR_INVALID_ID
                
            }else if(idEndereco>dadosID.length){
                return message.ERROR_NOT_FOUND
            }else{
                // Cria o objeto JSON para devolver os dados criados na requisição
                let atualizarEnderecoJSON = {}
        
                    if(dadoAtualizado.cep == ''    || dadoAtualizado.cep == undefined       ||  dadoAtualizado.cep == null               || dadoAtualizado.cep.length > 20 ||
                    dadoAtualizado.logradouro == ''  ||   dadoAtualizado.logradouro == undefined  || dadoAtualizado.logradouro == null   || dadoAtualizado.logradouro.length > 255 ||
                    dadoAtualizado.complemento == '' ||  dadoAtualizado.complemento == undefined || dadoAtualizado.complemento == null  || dadoAtualizado.complemento.length > 255 ||   
                    dadoAtualizado.cidade == '' ||  dadoAtualizado.cidade == undefined || dadoAtualizado.cidade == null  || dadoAtualizado.cidade.length > 150 ||
                    dadoAtualizado.numero == '' ||  dadoAtualizado.numero == undefined || dadoAtualizado.numero == null  || dadoAtualizado.numero.length > 30        
                    ){
                        return message.ERROR_REQUIRED_FIELDS
                    }
                
                    else{

                        
                        
                            // Encaminha os dados do filme para o DAO inserir no DB
                            let dadosEndereco = await enderecoDAO.updateEndereco(dadoAtualizado, idEndereco)

                            if(dadosEndereco){
                                let idEndereco = await enderecoDAO.idEndereco()
                                dadosEndereco.id_endereco = Number(idEndereco[0].id_endereco)
                            }
                
                            // Validação para verificar se o DAO inseriu os dados do DB
                        
                            if(dadosEndereco){
                                //Cria o JSON de retorno dos dados (201)
                                atualizarEnderecoJSON.usuario      = dadosEndereco
                                atualizarEnderecoJSON.status      = message.SUCCESS_UPDATED_ITEM.status
                                atualizarEnderecoJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                                atualizarEnderecoJSON.message     = message.SUCCESS_UPDATED_ITEM.message
                                return atualizarEnderecoJSON //201
                                
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

const setDeletarEndereco = async function(id){
    try {
        let idEndereco = id
    
        if(idEndereco == '' || idEndereco == undefined || idEndereco == isNaN(idEndereco) || idEndereco == null){
            return message.ERROR_INVALID_ID
        }else{        

            let dadosEndereco = await enderecoDAO.deleteEndereco(idEndereco)
    
        
            if(dadosEndereco){
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

const setListarEndereco = async function(){
    try {
        let enderecoJSON = {}

   let dadosEndereco= await enderecoDAO.selectAllEndereco()
   {
    if(dadosEndereco){

        if(dadosEndereco.length> 0){
            enderecoJSON.endereco = dadosEndereco
            enderecoJSON.quantidade = dadosEndereco.length
            enderecoJSON.status_code = 200
            return enderecoJSON
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

const setListarEnderecoById = async function(id){
    try {
        // Recebe o id do filme
     
    let idEndereco = id

    //Cria o objeto JSON
    let enderecoJSON = {}


    //Validação para verificar se o id é válido(Vazio, indefinido e não numérico)
    if(idEndereco == '' || idEndereco == undefined || isNaN(idEndereco)){
        return message.ERROR_INVALID_ID // 400
    }else{

        //Encaminha para o DAO localizar o id do filme 
        let dadosEndereco = await enderecoDAO.selectEnderecoByid(idEndereco)

        // Validação para verificar se existem dados de retorno
        if(dadosEndereco){

            // Validação para verificar a quantidade de itens encontrados.
            if(dadosEndereco.length > 0){
                //Criar o JSON de retorno
                enderecoJSON.endereco = dadosEndereco
                enderecoJSON.status_code = 200
    
                
                return enderecoJSON
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
    setInserirEndereco,
    setAtualizarEndereco,
    setDeletarEndereco,
    setListarEndereco,
    setListarEnderecoById
}