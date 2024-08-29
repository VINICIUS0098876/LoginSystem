CREATE DATABASE db_login;
USE db_login;

CREATE TABLE tbl_usuarios(
id_usuario INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL,
cpf VARCHAR(15) NOT NULL,
sexo VARCHAR(20) NOT NULL,
senha VARCHAR(255) NOT NULL
);

drop table tbl_usuarios;

CREATE TABLE tbl_enderecos(
id_endereco INT PRIMARY KEY AUTO_INCREMENT,
cep VARCHAR(20) NOT NULL,
logradouro VARCHAR(255) NOT NULL,
complemento VARCHAR(255),
cidade VARCHAR(150) NOT NULL,
numero VARCHAR(30) NOT NULL,
id_usuario INT,
CONSTRAINT FK_USUARIO_ENDERECO
FOREIGN KEY (id_usuario) REFERENCES tbl_usuarios (id_usuario)
);

SELECT MAX(id_usuario) AS id FROM tbl_usuarios;
