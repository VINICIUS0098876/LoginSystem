CREATE DATABASE db_vital;
USE db_vital;

drop database db_vital;

-- Tabela de sexos
CREATE TABLE tbl_sexo (
    id_sexo INT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(20) NOT NULL UNIQUE
);

select * from tbl_sexo where id_sexo = 1;

-- Inserir sexos padrão
INSERT INTO tbl_sexo (descricao) VALUES ('Masculino');
INSERT INTO tbl_sexo (descricao) VALUES ('Feminino');

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
CREATE TABLE tbl_usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY, 
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(320) NOT NULL,      -- Aumentado para suportar emails mais longos
    cpf VARCHAR(15) NOT NULL UNIQUE,  -- CPF único para garantir consistência
    id_sexo INT NOT NULL,
    senha VARCHAR(255) NOT NULL,      -- Certifique-se de hashear as senhas
    data_nascimento DATE NOT NULL,    -- Data de nascimento
    FOREIGN KEY (id_sexo) REFERENCES tbl_sexo(id_sexo)
);

-- Tabela de Endereços
CREATE TABLE tbl_enderecos (
    id_endereco INT PRIMARY KEY AUTO_INCREMENT,
    cep VARCHAR(20),
    logradouro VARCHAR(255),
    complemento VARCHAR(255),
    cidade VARCHAR(150),
	estado VARCHAR(20),
    numero VARCHAR(30),
    id_usuario INT,
    CONSTRAINT FK_ENDERECO_USUARIO
    FOREIGN KEY (id_usuario) REFERENCES tbl_usuarios(id_usuario)
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

drop procedure sp_inserir_usuario_com_endereco;

DELIMITER $$

CREATE PROCEDURE sp_inserir_usuario_com_endereco(
    IN p_nome VARCHAR(255),
    IN p_email VARCHAR(320),
    IN p_cpf VARCHAR(15),
    IN p_id_sexo INT,
    IN p_senha VARCHAR(255),
    IN p_data_nascimento DATE,
    IN p_cep VARCHAR(20),
    IN p_logradouro VARCHAR(255),
    IN p_complemento VARCHAR(255),
    IN p_cidade VARCHAR(150),
    IN p_estado VARCHAR(20),
    IN p_numero VARCHAR(30)
)
BEGIN
    -- A declaração de variáveis deve vir logo após o BEGIN
    DECLARE last_user_id INT;

    -- Inserindo o usuário
    INSERT INTO tbl_usuarios (nome, email, cpf, id_sexo, senha, data_nascimento)
    VALUES (p_nome, p_email, p_cpf, p_id_sexo, p_senha, p_data_nascimento);
    
    -- Obtendo o ID do usuário recém-inserido
    SET last_user_id = LAST_INSERT_ID();
    
    -- Inserindo o endereço do usuário
    INSERT INTO tbl_enderecos (cep, logradouro, complemento, cidade, estado, numero, id_usuario)
    VALUES (p_cep, p_logradouro, p_complemento, p_cidade, p_estado, p_numero, last_user_id);
END$$

DELIMITER ;

CREATE VIEW vw_usuarios_enderecos AS
SELECT 
    u.id_usuario, 
    u.nome, 
    u.email, 
    u.senha,
    u.cpf, 
    s.descricao AS sexo, 
    u.data_nascimento,
    e.cep, 
    e.logradouro, 
    e.complemento, 
    e.cidade, 
    e.estado,
    e.numero
FROM 
    tbl_usuarios u
JOIN 
    tbl_enderecos e ON u.id_usuario = e.id_usuario
JOIN
    tbl_sexo s ON u.id_sexo = s.id_sexo;
    
    drop view vw_usuarios_enderecos;

-- Teste da procedure
CALL sp_inserir_usuario_com_endereco(
    'João Silva', 
    'joao.silva@email.com', 
    '123.456.789-09', 
    1,  -- ID para 'Masculino'
    'senhaSegura123', 
    '1985-08-15', 
    '01001-000', 
    'Rua Exemplo', 
    'Apt 101', 
    'São Paulo', 
    '123'
);

-- Verificar dados
SELECT * FROM vw_usuarios_enderecos;


DELIMITER $$

CREATE TRIGGER trg_delete_usuario_endereco
BEFORE DELETE ON tbl_usuarios
FOR EACH ROW
BEGIN
    -- Deletar o endereço associado ao usuário
    DELETE FROM tbl_enderecos
    WHERE id_usuario = OLD.id_usuario;
END$$

DELIMITER ;

drop trigger trg_delete_usuario_endereco; 


-- Deletar um usuário (e automaticamente seu endereço será deletado)
DELETE FROM tbl_usuarios
WHERE id_usuario = 1;

SELECT * FROM tbl_usuarios;



CREATE VIEW vw_informacoes_usuario AS
SELECT 
    u.id_usuario, 
    u.nome, 
    u.email, 
    u.cpf, 
    s.descricao AS sexo, 
    u.data_nascimento,
    e.cep, 
    e.logradouro, 
    e.complemento, 
    e.cidade, 
    e.numero
FROM 
    tbl_usuarios u
JOIN 
    tbl_enderecos e ON u.id_usuario = e.id_usuario
JOIN
    tbl_sexo s ON u.id_sexo = s.id_sexo;
    
    
    


drop procedure sp_login_usuario;


DELIMITER $$

CREATE PROCEDURE sp_login_usuario (
    IN p_email VARCHAR(320),
    IN p_senha VARCHAR(255)
)
BEGIN
    DECLARE v_senha_armazenada VARCHAR(255);
    
    -- Buscar a senha armazenada do usuário com base no e-mail
    SELECT senha INTO v_senha_armazenada
    FROM tbl_usuarios
    WHERE email = p_email
    LIMIT 1;
    
    -- Verificar se a senha fornecida corresponde à senha armazenada
    IF v_senha_armazenada IS NOT NULL AND v_senha_armazenada = p_senha THEN
        -- Se as senhas coincidirem, buscar as informações do usuário e do endereço
        SELECT 
            u.id_usuario, 
            u.nome, 
            u.email, 
            u.cpf, 
            s.descricao AS sexo, 
            u.data_nascimento,
            e.cep, 
            e.logradouro, 
            e.complemento, 
            e.cidade, 
            e.numero
        FROM 
            tbl_usuarios u
        JOIN 
            tbl_enderecos e ON u.id_usuario = e.id_usuario
        JOIN
            tbl_sexo s ON u.id_sexo = s.id_sexo
        WHERE 
            u.email = p_email;
    ELSE
        -- Caso a senha não coincida
        SELECT 'Senha incorreta' AS erro;
    END IF;
END$$

DELIMITER ;




select * from tbl_usuarios;

CALL sp_login_usuario(
            'vinicius@gmail.com',
            'Vini126'
        );
CALL sp_login_usuario(
    'vinicius@gmail.com',  -- E-mail do usuário
    '$2b$10$t0KkFgNLe2UQWvlDUVufcOseIWHVfTmEEzaGCNfWgYJECsodaad7i'         -- Senha fornecida pelo usuário
);

CALL sp_login_usuario(
            'vinicius@gmail.com',
            '$2b$10$rrgEAs9.bQ6KgfT/YMWL0e2sizSSo6YSOGIciVELG.J7Ikb/JQO4i'
        );
        
        CALL sp_login_usuario(
            'vinicius@gmail.com',
            '$2b$04$KF0.X00O0BF33pOWYVa5GeGMCogRD6qoxt8YN4LuNxKOXGnf15qzC'
        );
select * from tbl_usuarios;