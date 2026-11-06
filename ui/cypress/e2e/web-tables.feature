Feature: Web Tables

  # Deck: criar um registro, editá-lo e deletá-lo. A busca e a exclusão usam o e-mail gerado.
  # Linha que o teste não criou permanece. O e-mail é único da execução.
  # Passa quando a busca mostra os valores enviados, a mesma linha mostra salário e
  # departamento novos, e a busca seguinte não devolve registro.
  Scenario: Criar, editar e deletar um registro
    Given que a tabela web está aberta
    When crio um registro com dados da execução
    Then a busca pelo e-mail mostra os valores enviados
    When edito o salário e o departamento desse registro
    Then a mesma linha mostra os valores novos
    When deleto o registro
    Then a busca por aquele e-mail não devolve registro

  # Deck: bônus. Criar 12 registros de forma dinâmica e deletar todos.
  # Não depende do cenário anterior. A massa nasce no step, com índice de 1 a 12
  # e um sufixo da execução, para não colidir com sobra de uma execução anterior.
  # Passa quando cada um dos 12 e-mails aparece na tabela e, depois da remoção, nenhum permanece.
  Scenario: Criar e remover 12 registros dinâmicos
    Given que a tabela web está aberta
    When crio 12 registros dinâmicos
    Then cada um dos 12 e-mails aparece na tabela
    When removo os 12 registros
    Then nenhum desses e-mails permanece
