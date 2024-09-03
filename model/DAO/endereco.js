// Importa de biblioteca do @prisma/client
const { PrismaClient } = require('@prisma/client')


// Instacia da classe PrismaClient
const prisma = new PrismaClient()

const insertEndereco = async function(dadosEndereco){
    try {
        const sql = `insert into tbl_enderecos(cep, logradouro, complemento, cidade, numero, id_usuario)values('${dadosEndereco.cep}',
        '${dadosEndereco.logradouro}',
        '${dadosEndereco.complemento}',
        '${dadosEndereco.cidade}',
        '${dadosEndereco.numero}',
        '${dadosEndereco.id_usuario}')`
        console.log(sql)
        
        let result = await prisma.$executeRawUnsafe(sql)

        if(result){
           return true
        }else{
           return false
        }
    } catch (error) {
        console.log(error)
        return false
    }
}

const updateEndereco = async function(dadosEndereco, idEndereco){
    let sql
    try {
        sql = `update tbl_enderecos set
        cep = '${dadosEndereco.cep}',
        logradouro = '${dadosEndereco.logradouro}',
        complemento = '${dadosEndereco.complemento}',
        cidade = '${dadosEndereco.cidade}',
        numero = '${dadosEndereco.numero}',
        id_usuario = '${dadosEndereco.id_usuario}'
        where tbl_enderecos.id_endereco = ${idEndereco}`
        
        console.log(sql)
        let result = await prisma.$executeRawUnsafe(sql)
        if(result){
        return true
     }else{
        return false
     }
    } catch (error) {
        console.log(error);
        return false
    }
}

const deleteEndereco = async function(id){
    try {
        let sql = `delete from tbl_enderecos WHERE id_endereco = ${id}`


        
        let rsEndereco = await prisma.$executeRawUnsafe(sql);
        console.log(sql);

        return rsEndereco
    } catch (error) {
        console.log(error)
        return false
    }
}

const selectAllEndereco = async function(){
    try {
        let sql = 'select * from tbl_Enderecos'; 

    let rsEndereco = await prisma.$queryRawUnsafe(sql)

    if(rsEndereco.length > 0 )
    return rsEndereco
    } catch (error) {
        console.log(error);
        return false 
    }; 
}

const selectEnderecoByid = async function(id){
    try {
        // Realiza a busca do genero pelo ID
        let sql = `select * from tbl_enderecos where id_endereco = ${id}`;
    
        // Executa no banco de dados o script sql
        let rsEndereco = await prisma.$queryRawUnsafe(sql);

            return rsEndereco;
    
        } catch (error) {
            console.log(error);
            return false;
            
        }
}

const idEndereco = async function(){
    try {
        let sql = `select cast(last_insert_id() as DECIMAL) as id from tbl_enderecos limit 1`

        let sqlID = await prisma.$queryRawUnsafe(sql)

        return sqlID
    } catch (error) {
        console.log(error);
        return false
    }
}

module.exports = {
    insertEndereco,
    updateEndereco,
    deleteEndereco,
    selectAllEndereco,
    selectEnderecoByid,
    idEndereco
}