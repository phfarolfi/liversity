# liversity
liversity é um sistema de gerenciamento de atividades extracurriculares da Universidade Federal Rural do Rio de Janeiro (UFRRJ) a ser desenvolvido por estudantes de Ciência da Computação na disciplina de Programação Web 2021-2, ministrada pelo docente Filipe Braida.

## Motivação

Após cerca de dois anos com os cursos da graduação da UFRRJ sendo realizados de forma remota em decorrência da pandemia de Covid-19, foi divulgado o retorno às aulas presenciais, no início de 2022. Essa pandemia impactou como as relações interpessoais funcionavam e não possibilitou com que os novos discentes aprovados nos concursos desses últimos anos tivessem a oportunidade de se integrar com o ambiente acadêmico ainda. Além disso, há a necessidade de centralizar informações relacionadas às atividades extracurriculares possíveis de serem realizadas pela universidade, já que atualmente, muitos discentes não conseguem encontrar com facilidade essas informações. Considerando esses contextos, surge a necessidade de desenvolver um sistema que seja capaz de gerenciar as atividades extracurriculares e, com isso, será possível conectar a comunidade acadêmica, oferecendo-lhes oportunidades de interação com outras pessoas e de aprimoramento na formação profissional, além de facilitar para o discente na busca de informações sobre essas atividades. 

## Minimundo

O sistema deverá disponibilizar informações relacionadas às divulgações de eventos de atividades extracurriculares, cadastradas por responsáveis dos eventos, que forem aprovadas por determinados coordenadores de cursos. Eventos já encerrados também deverão aparecer no histórico no mural de atividades. Os eventos poderão ser pesquisados por campus ou por categoria de atividade, tornando mais fácil de encontrar uma atividade que tenha mais a ver com a preferência do aluno.

Para o cadastro de um evento, é necessário informar dados como o nome do evento, categoria da atividade extracurricular, descrição, data limite para a inscrição no evento, responsável pelo evento, foto do evento, link do grupo (*WhatsApp/Telegram/Facebook/Discord*,etc) que será utilizado como o meio de comunicação, além do documento que oficializa a atividade extracurricular. Também deverá ser possível alterar esses dados caso haja necessidade. Se um evento estiver encerrado, o sistema também deverá possibilitar a inserção de informações adicionais a esse evento, como vídeos e fotos do evento.

Os discentes cadastrados poderão se inscrever e se desinscrever de um evento já cadastrado até que as inscrições do evento selecionado sejam encerradas. A informação relacionada ao meio de comunicação de um evento somente deverá ser divulgada ao inscrito assim que for realizada a inscrição. Além disso, se um determinado evento possuir inscritos, o responsável por este evento poderá analisar os perfis dos inscritos. Caso um evento já tenha sido concluído, o responsável do evento também poderá marcar presença dos participantes para que seja gerado um comprovante de participação do evento ao participante.

Os discentes também poderão adicionar informações em seu perfil dados como seu nome, data de nascimento, gênero, CPF, e-mail, matrícula da UFRRJ, campus em que estuda e o curso da graduação, seus interesses e hobbies, além de atividades extracurriculares que já fez. 

## Pré-requisitos
Para conseguir executar o projeto, é necessário que você tenha instalado na máquina os softwares a seguir:
- Node.js na versão v14 ou superior. Para instalar o node.js, acesse o link: https://nodejs.org/en/download/
- Visual Studio Code. Para instalar o software, acesse o link: https://code.visualstudio.com/Download

## Instalação do Projeto
1 - Crie o ```.env```
```
cp .env.example .env
```

2 - Instale as dependências do projeto:
```
npm install
```

3 - Inicialize o projeto: 
```
node ace serve --watch
```
