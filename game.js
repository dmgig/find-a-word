(function(data){
  'use strict';
  
  console.log(data);
  
  var wordfinder = {
    init: function(){
      this.wordlist.create();
      this.gameboard.create();
      this.controls.create();
    },
    reset: function(){
      console.log('reset');
      $('body').empty();
      this.init();
    },
    resign: function(){
      console.log('resign');
    },
    
    controls:{
      create: function(){
        $('#reset').on('click', wordfinder.reset);
        $('#resign').on('click', wordfinder.resign);
      }
    },
    
    wordlist:{
      display: $('<div></div>').attr('id', 'wordlist'),
      create: function(){

        $('#wordlist-container')
          .append(this.display);

        for(var i in data.wordlist){
          var word = $('<span>'+data.wordlist[i]+'</span>')
                        .addClass('word');
          this.display.append(word);
        }
      }
    },
    
    gameboard: {
      board: $('<table></table>').attr('id','gameboard'),
      create: function(){

        $('#gameboard-container')
          .append(this.board);
        
        for(var i in data.gameboard){
          
          this.board.append('<tr></tr>');
          
          for(var j in data.gameboard[i]){
            var letter     = data.gameboard[i][j];
            var gamesquare = $('<td>'+letter+'</td>')
                                .data('x',i)
                                .data('y',j); 
                                
            this.board
              .find('tr:eq('+i+')')
              .append(gamesquare);

          }
        }
      }
      
    }
    
    
    
    
  }
  
  wordfinder.init();
  
})(data)
