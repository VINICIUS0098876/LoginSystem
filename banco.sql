CREATE DATABASE db_login;
USE db_login;

CREATE TABLE tbl_usuarios(
id_usuario INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL,
cpf VARCHAR(15) NOT NULL,
sexo VARCHAR(20) NOT NULL,
senha VARCHAR(255) NOT NULL,
cep VARCHAR(20) NOT NULL,
logradouro VARCHAR(255) NOT NULL,
complemento VARCHAR(255),
cidade VARCHAR(150) NOT NULL,
numero VARCHAR(30) NOT NULL
);

drop database db_login;

