<h1 align="center"> Games API </h1>

<p align="center">
  Made with :coffee: by <a href="https://www.linkedin.com/in/nicholas-cabral-dos-anjos-13b3981a7/" target="_blank"> Nicholasscabral </a> 
</p>

__<p align="center">Uma API de games, que retorna dados como titulo, preço e data de lançamento</p>__

<p align="center">
  <img src="https://img.shields.io/github/last-commit/nicholasscabral/GamesAPI"> 
  <img src="https://img.shields.io/github/languages/top/nicholasscabral/GamesAPI"> 
  <img src="https://img.shields.io/github/languages/count/nicholasscabral/GamesAPI"> 
  <img src="https://img.shields.io/github/repo-size/nicholasscabral/GamesAPI"> 
</p>

<div align="center">

  [Technologies](#construction_worker-built-with) | 
  [API](#globe_with_meridians-api) | 
  [How to run](#triangular_flag_on_post-how-to-run) |
  [Extras](#exclamation-extras) 
  
</div>

# :pushpin: Endpoints
## GET / games
Esse endpoint é responsavel por retornar a listagem de todos os games cadastrados no banco de dados
## Parâmetros
Nenhum
### Respostas 
#### Sucesso | 200
Operação bem sucedida, será retornada a listagem dos games <br>
Exemplo de resposta:
```
[
    {
      "id": 8,
      "title": "Call of Duty - MW3",
      "price": 250,
      "year": 2010
    },
    {
      "id": 9,
      "title": "Dragon age inquisition",
      "price": 150,
      "year": 2014
    }
]
```
#### Falha na autenticação | 401
Ocorreu um erro na autenticação da requisição
Motivos: Token invalido ou Token expirado <br>
Exemplo de resposta:
```
{
  "message": "Invalid Token"
}
```
