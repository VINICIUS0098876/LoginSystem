CREATE DATABASE db_vital;
USE db_vital;

-- Tabela de empresas
CREATE TABLE tbl_empresa (
    id_empresa INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    nome_proprietario VARCHAR(100) NOT NULL,
    senha VARCHAR(255) NOT NULL,      -- Certifique-se de hashear as senhas (ex: bcrypt)
    cnpj VARCHAR(18) NOT NULL UNIQUE,
    email VARCHAR(320) NOT NULL,      -- Aumentado para suportar emails mais longos
    cep VARCHAR(20) NOT NULL,
    logradouro VARCHAR(255) NOT NULL,
    complemento VARCHAR(255),
    cidade VARCHAR(150) NOT NULL,
    numero VARCHAR(30) NOT NULL
);

-- Tabela de usuários
CREATE TABLE tbl_usuarios(
    id_usuario INT AUTO_INCREMENT PRIMARY KEY, 
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(320) NOT NULL,      -- Aumentado para suportar emails mais longos
    cpf VARCHAR(15) NOT NULL UNIQUE,  -- CPF único para garantir consistência
    sexo VARCHAR(20) NOT NULL,
    senha VARCHAR(255) NOT NULL,      -- Certifique-se de hashear as senhas
    data_nascimento DATE NOT NULL    -- Data de nascimento
);


-- Tabela de Endereços
CREATE TABLE tbl_enderecos(
id_endereco INT PRIMARY KEY AUTO_INCREMENT,
cep VARCHAR(20) NOT NULL,
logradouro VARCHAR(255) NOT NULL,
complemento VARCHAR(255),
cidade VARCHAR(150) NOT NULL,
numero VARCHAR(30) NOT NULL,
id_usuario INT,
constraint FK_ENDERECO_USUARIO
foreign key(id_usuario) references tbl_usuarios (id_usuario)
);

-- Tabela de médicos
CREATE TABLE tbl_medicos (
    id_medico INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT,  -- Relaciona com a empresa
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(320) NOT NULL,      -- Aumentado para suportar emails mais longos
    senha VARCHAR(255) NOT NULL,      -- Certifique-se de hashear as senhas
    telefone VARCHAR(20) NOT NULL,
    crm VARCHAR(20) NOT NULL UNIQUE,  -- CRM único
    data_nascimento DATE NOT NULL,    -- Data de nascimento
    FOREIGN KEY (id_empresa) REFERENCES tbl_empresa(id_empresa) ON DELETE CASCADE -- Se empresa for excluída, médicos são excluídos
);

-- Tabela de especialidades
CREATE TABLE tbl_especialidades (
    id_especialidade INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,         -- Descrição da especialidade
    imagem_url VARCHAR(255) NOT NULL -- URL da imagem armazenada no Firebase
);

-- Tabela intermediária médico-especialidade
CREATE TABLE tbl_medico_especialidade (
    id_medico INT,
    id_especialidade INT,
    PRIMARY KEY (id_medico, id_especialidade),
    FOREIGN KEY (id_medico) REFERENCES tbl_medicos(id_medico) ON DELETE CASCADE, -- Exclui especialidades associadas se médico for removido
    FOREIGN KEY (id_especialidade) REFERENCES tbl_especialidades(id_especialidade) ON DELETE CASCADE -- Exclui associações se especialidade for removida
);

-- Tabela intermediária empresa-especialidade
CREATE TABLE tbl_empresa_especialidade (
    id_empresa INT,
    id_especialidade INT,
    PRIMARY KEY (id_empresa, id_especialidade),
    FOREIGN KEY (id_empresa) REFERENCES tbl_empresa(id_empresa) ON DELETE CASCADE, -- Exclui especialidades associadas se empresa for removida
    FOREIGN KEY (id_especialidade) REFERENCES tbl_especialidades(id_especialidade) ON DELETE CASCADE -- Exclui associações se especialidade for removida
);

-- Tabela de avaliações
CREATE TABLE tbl_avaliacoes (
    id_avaliacao INT AUTO_INCREMENT PRIMARY KEY,
    id_medico INT,
    id_usuario INT,
    nota TINYINT NOT NULL CHECK (nota BETWEEN 1 AND 5), -- Nota de 1 a 5
    comentario TEXT,
    data_avaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_medico) REFERENCES tbl_medicos(id_medico) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES tbl_usuarios(id_usuario) ON DELETE CASCADE
);

-- Tabela de vídeos
CREATE TABLE tbl_videos (
    id_video INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    url VARCHAR(255) NOT NULL,         -- URL do vídeo armazenada no Firebase
    data_publicacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_empresa) REFERENCES tbl_empresa(id_empresa) ON DELETE CASCADE -- Se empresa for excluída, vídeos são excluídos
);

-- Índices para melhorar a performance de buscas frequentes
CREATE INDEX idx_email_usuario ON tbl_usuarios(email);
CREATE INDEX idx_crm_medico ON tbl_medicos(crm);

DROP DATABASE db_vital;

DELIMITER $$

CREATE PROCEDURE sp_inserir_usuario_com_endereco(
    IN p_nome VARCHAR(255),
    IN p_email VARCHAR(320),
    IN p_cpf VARCHAR(15),
    IN p_sexo VARCHAR(20),
    IN p_senha VARCHAR(255),
    IN p_data_nascimento DATE,
    IN p_cep VARCHAR(20),
    IN p_logradouro VARCHAR(255),
    IN p_complemento VARCHAR(255),
    IN p_cidade VARCHAR(150),
    IN p_numero VARCHAR(30)
)
BEGIN
    -- A declaração de variáveis deve vir logo após o BEGIN
    DECLARE last_user_id INT;

    -- Inserindo o usuário
    INSERT INTO tbl_usuarios (nome, email, cpf, sexo, senha, data_nascimento)
    VALUES (p_nome, p_email, p_cpf, p_sexo, p_senha, p_data_nascimento);
    
    -- Obtendo o ID do usuário recém-inserido
    SET last_user_id = LAST_INSERT_ID();
    
    -- Inserindo o endereço do usuário
    INSERT INTO tbl_enderecos (cep, logradouro, complemento, cidade, numero, id_usuario)
    VALUES (p_cep, p_logradouro, p_complemento, p_cidade, p_numero, last_user_id);
END$$

DELIMITER ;

CREATE VIEW vw_usuarios_enderecos AS
SELECT 
    u.id_usuario, 
    u.nome, 
    u.email, 
    u.senha,
    u.cpf, 
    u.sexo, 
    u.data_nascimento,
    e.cep, 
    e.logradouro, 
    e.complemento, 
    e.cidade, 
    e.numero
FROM 
    tbl_usuarios u
JOIN 
    tbl_enderecos e ON u.id_usuario = e.id_usuario;
    
    drop view vw_usuarios_enderecos;
    
    
    CALL sp_inserir_usuario_com_endereco(
    'João Silva', 
    'joao.silva@email.com', 
    '123.456.789-09', 
    'Masculino', 
    'senhaSegura123', 
    '1985-08-15', 
    '01001-000', 
    'Rua Exemplo', 
    'Apt 101', 
    'São Paulo', 
    '123'
);


SELECT * FROM vw_usuarios_enderecos;