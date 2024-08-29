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
                let ultimoID=usuarioDAO.idUsuario()
                dadosEndereco.id_usuario=ultimoID[0].id
                // Encaminha os dados do filme para o DAO inserir dados
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

const setAtualizarEndereco = async function(){}

const setDeletarEndereco = async function(){}

const setListarEndereco = async function(){}

const setListarEnderecoById = async function(){}

module.exports = {
    setInserirEndereco,
    setAtualizarEndereco,
    setDeletarEndereco,
    setListarEndereco,
    setListarEnderecoById
}