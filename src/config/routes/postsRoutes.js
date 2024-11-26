import express from 'express';
import multer from 'multer';
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost } from '../controllers/postsControllers.js';
import cors from 'cors';

const corsOptions = {
  origin: 'http://localhost:8000',
  optionsSuccessStatus: 200
}

// Configura o armazenamento de arquivos enviados
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define o diretório para salvar os arquivos (pode ser personalizado)
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Define o nome do arquivo (mantém o nome original)
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });
// Cria uma instância do multer com as configurações de armazenamento

const routes = (app) => {
  app.use(express.json());
  // Habilita o parsing de JSON para as requisições
  app.use(cors(corsOptions))
  // Rotas da API
  app.get('/posts', listarPosts);
  // Busca todos os posts
  app.post('/posts', postarNovoPost);
  // Cria um novo post
  app.post('/upload', upload.single('imagem'), uploadImagem);
  // Faz o upload de uma imagem (espera um campo 'imagem' no formulário)
  app.put('/upload/:id', atualizarNovoPost)
};

export default routes;