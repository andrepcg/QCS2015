# QCS2015
Projecto QCS 2015 @ DEI.uc.pt

# Web services e programação N-Versões

O objectivo deste trabalho é desenvolver um webservice baseado em programação N-versões para calcular a dose de insulina em pacientes diagnosticados com Diabetes Tipo-II. Para o realizar, cada grupo irá criar a sua versão do webservice com base na mesma especificação e utilizará os webservices desenvolvidos pelos restantes grupos para fornecer os vários inputs ao votador. Para interagir com o sistema irá ser desenvolvido um pequeno website que interage com este votador e disponibiliza o resultado na página.

![enter image description here](https://lh6.googleusercontent.com/LBZy_KA0zTLUn8GvBnai_kF594KP59eVxJsvT2U_UlUkFH-SECmAJQZnTutP7hFLARXc_4N-VuqrfS5Z5872uy_vLIN_AhO25vOPCTCSYtfird6cHEh8ToQdlN84NFXdXYCj9HI)

----------


Votador
-------------

O web server (interface + votador) foi desenvolvido em Node.js (javascript) por ser uma ferramenta prática e fácil de integrar. Esta ferramenta foi também escolhida devido à própria natureza assíncrona da linguagem sendo single-threaded e capaz de superar sistemas multi-threaded, em determinadas condições, devido ao seu Event-Loop. Este web server contém duas componentes, uma que disponibiliza uma interface ao utilizador (web site) e a componente do votador que pode ser acedida através de uma API REST. Ao aceder a esta API o resultado será já o final depois de terem sido comparadas as N-versões. 

![enter image description here](https://lh4.googleusercontent.com/uPL014IP6oZKhdLqxcTewH02JLV7Tiu5C4OsmC3Ozna2D7IaIMTNUlUC-5mf6HyQRWgF7wSs7IPwag8WtNQyyyv4wBz6wqUbPB3R_JsIWTlS-Jy9nQe0F9hjxOu_GKUt2fs2rBo)


Conceptualmente o Votador é um sistema simples que compara os resultados de execuções do mesmo procedimento em versões de software diferentes com o objectivo de estabelecer o resultado mais comum. Quando o utilizador pretende calcular a dose de insulina, o web server onde se encontra o Votador recebe a notificação e inicia o processo.

 1. Para cada webservice é chamado o método remoto com os parâmetros do utilizador de forma assíncrona, com um timeout de 1 segundo.
 2. Assim que os N clientes disponibilizam resposta (ou o seu timeout expira), os resultados são passados ao sistema de votação.
 3. Tenta-se determinar a moda (valor mais frequente) das N respostas. Retorna este valor caso haja no mínimo 3 respostas para este valor. Se existirem vários valores para a moda (valores com a mesma frequência) retorna o valor mais baixo.
 4. Caso não existam resultados suficientes (< 3), assume-se que valores que distam do valor mais frequente 1 unidade (± 1). Retornar caso sejam encontrados no mínimo 3 valores dentro deste critério. No caso de múltiplas modas a comparação é feita a partir de todas as modas e é devolvido o valor que for mais baixo.
 5. Caso o sistema de votação não consiga determinar uma resposta, retorna um valor nulo.


![enter image description here](https://lh3.googleusercontent.com/Rg8WSJQorlmJPAlgsIQCmgISpJhwH7GyPRztd1EP_XkrpgtSybY8tJgvHljFfYQhqE9hld5CegYC5kiIIyeQOr9LUvDuKqvRCPKAD34WW_dYypLVF_xss-551PNpRh24V8id0NA)

Javascript é uma linguagem assíncrona através de eventos e Node.js aproveita essa característica com a ajuda do Event-Loop. Desta forma, quando se executa um método moroso (como pedidos via internet), este método corre dentro do Event-Loop e assim que acabe de executar é lançado um evento que notifica que aquele pedido já concluiu. Desta forma, para executarmos os vários pedidos aos N webservices em simultâneo e sincronizar os seus resultados, usamos uma biblioteca bastante popular no mundo do Javascript denominada async. Esta biblioteca tem um método (async.parallel) que permite definir que funções executar e essas funções serão executadas em “paralelo” e só lança o evento quando todas as funções terminarem. O método a executar nos diferentes clientes WSDL (webservices) são chamados em paralelo (na realidade não é em paralelo pois continua a existir apenas uma thread) e no final de todas as chamadas os resultados são passados ao método que avalia os resultados e determina o comum. Foi definido também um timeout de 3 segundos na chamada remota ao método. Caso este timeout seja ultrapassado, o pedido é automaticamente cancelado e retorna um valor nulo que é interpretado correctamente pela função de avaliação (ignorando o valor).


Interface web
-------------------

O website está construído sobre as especificações fornecidas e encontra-se totalmente funcional. Ao entrar no website surge imediatamente um formulário que pode ser preenchido e por cima do mesmo encontra-se um pequeno menu de navegação que permite mudar para outro tipo de cálculo de insulina.

![enter image description here](https://lh6.googleusercontent.com/-kYUMm6zJ-f0wDsbRmmv-HYIJGZhMHvORSbsIaUj7UZImqMAXLkly76Ixn1Oa469zvb7NuWFLttl912LbmpwdVQRKFv6qxgpUGGfGkTlwXr54YO38Gk_T-Ac_nFRWi9qjTuLwUk)

Quando o utilizador submete informação inválida num determinado campo é automaticamente apresentado o erro associado. Na imagem seguinte temos um exemplo em que foi inserido o valor 20 quando é permitido apenas inserir valores entre 60 e 120. Caso fossem inseridos caracteres alfa-numéricos seria apresentado um erro relativamente ao campo permitir apenas caracteres numéricos. Desta forma o erro da parte do utilizador é minimizado, sendo confrontado com mensagens de erro ao executar incorrectamente uma acção, sendo este feedback imediato uma funcionalidade importante numa aplicação utilizada por inúmeros utilizadores e grande maioria destes inexperientes.

Existe também um botão que permite extender uma secção da interface, apresentando resultados detalhados do cálculo da dose de insulina. Esta secção é opcional e permite consultar os resultados individuais de cada versão do webservice. A imagem seguinte apresenta a secção detalhada, sendo possível ver o webservice que devolveu determinado resultado, bem como o tempo de resposta do mesmo. O sistema de cores permite facilmente distinguir os webservices que devolveram valores correctos (a verde), próximo da maioria (a amarelo) e valores errados e timeouts (a vermelho).

![enter image description here](https://lh4.googleusercontent.com/9cx9BEjsmhV2HF986QZ5xUw6ECsvKoJiJyjkE0xAqfy4vtf4q7CbY5DNkePd_PoIEreARogeIB0BkZ6WnI5mtoaFE_04Xd6Nf9_UrOTFblF7eVKN0-8rPGo3uz52wVyj2NQwaXk)

Conclusão
========
Com este trabalho conseguimos constatar a importância que programação N-versões tem em sistemas críticos. Através deste método, a probabilidade de existirem falhas de software idênticas em todas as versões é bastante reduzida, tornando assim o sistema mais viável. Porém, este método pode acarretar problemas como inconsistência de resultados, portanto é necessário garantir a validação do sistema. Numa aplicação como a que foi desenvolvida, através de programação em N-versões, podem existir simples erros de cálculo ou até mesmo de arredondamento que podem comprometer toda a confiabilidade do sistema e consequentemente criar danos no mundo real. Posto isto, é impreterível que se assegure a qualidade do sistema a desenvolver e que se proceda a uma correcta validação do mesmo.

