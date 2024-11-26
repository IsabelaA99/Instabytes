import {getTodosPosts, criarPost, atualizarPost} from "../models/postsModels.js";
import fs from 'fs';
import gerarDescricaoComGemini from '../services/geminiService.js'

export async function listarPosts(req, res) {
    // Define uma rota GET para o endpoint '/posts'.
    // Quando uma requisição GET for feita para essa rota, esta função será executada.
    const posts = await getTodosPosts();
    // Chama a função getTodosPosts() para buscar todos os posts do banco de dados.
    res.status(200).json(posts);
    // Envia os posts como resposta em formato JSON com o status HTTP 200 (sucesso).
}

export async function postarNovoPost(req, res) {
    const novoPost = req.body;
    try {
        const postCriado = await criarPost(novoPost);
        res.status(200).json(postCriado);
    } catch(erro) {
        console.erro(erro.message);
        res.status(500).json({'Erro':'Falha na requisição'});
    }
}

export async function uploadImagem(req, res) {
    const novoPost = {
        descricao: '',
        imgUrl: req.file.originalname,
        alt:''
    };

    try {
        const postCriado = await criarPost(novoPost);
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`
        fs.renameSync(req.file.path, imagemAtualizada);
        res.status(200).json(postCriado);
    } catch(erro) {
        console.erro(erro.message);
        res.status(500).json({'Erro':'Falha na requisição'});
    }
}

export async function atualizarNovoPost(req, res) {
    const id = req.params.id;
    const urlImagem = `http://localhost:3000/${id}.png`;
    //montando um objeto que representa o nosso post com todos os dados da requisição

    try {
        const imageBuffer = fs.readFileSync(`uploads/${id}.png`);
        const descricao = await gerarDescricaoComGemini(imageBuffer);

        const post = {
            imgUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt
        }

        const postCriado = await atualizarPost(id, post);
        res.status(200).json(postCriado);
    } catch(erro) {
        console.erro(erro.message);
        res.status(500).json({'Erro':'Falha na requisição'});
    }
}