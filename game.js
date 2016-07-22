(function(data){
  'use strict';
  
  console.log(data);
  
  var wordfinder = {
    init: function(){
      console.log('init');
      wordfinder.wordlist.create();
      wordfinder.gameboard.create();
      wordfinder.controls.create();
    },
    reset: function(){
      console.log('reset');
      $("#wordlist-container").empty();
      $("#gameboard-container").empty();
      wordfinder.init();
    },
    resign: function(){
      console.log('resign');
      $("#wordlist-container").empty();
      $("#gameboard-container").empty();      
    },
    
    controls:{
      create: function(){
        $('#reset').off().on('click', wordfinder.reset);
        $('#resign').off().on('click', wordfinder.resign);
      }
    },
    
    wordlist:{
      create: function(){
        console.log('create wordlist');
        
        var display = $('<div></div>')
                        .attr('id', 'wordlist');
        $('#wordlist-container')
          .append(display);

        for(var i in data.wordlist){
          var word = $('<span>'+data.wordlist[i]+'</span>')
                        .addClass('word');
          display.append(word);
        }
      }
    },
    
    gameboard: {
      create: function(){

        var board = $('<table></table>')
                      .attr('id','gameboard');
        $('#gameboard-container')
          .append(board);
        
        for(var i in data.gameboard){
          
          board.append('<tr></tr>');
          
          for(var j in data.gameboard[i]){
            var letter     = data.gameboard[i][j];
            var gamesquare = $('<td>'+letter+'</td>')
                                .data('x',i)
                                .data('y',j); 
                                
            board
              .find('tr:eq('+i+')')
              .append(gamesquare);

          }
        }
      }
      
    }
    
    
    
    
  }
  
  wordfinder.init();
  
})(data)
