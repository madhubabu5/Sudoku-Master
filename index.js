
/*Loading the initial board using strings*/

const easy = [
    "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
  ];
  const medium = [
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
    "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
  ];
  const hard = [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
  ];

  var timer;
  var timeRemaining;
  var lives;
  var selectedNum;
  var selectedTile;
  var disableSelect;



  window.onload=function(){
      var startButton = document.getElementById("start-btn");
      startButton.addEventListener("click",startGame);      //calling startGame function when button is clicked 

      //Add event listner to each number in number container
      var allNums = document.getElementById("number-container").children;
      for(let i=0;i<allNums.length;i++)
      {
          allNums[i].addEventListener("click",function(){
            //if selecting is not disabled
            if(!disableSelect)
            {
                //if that num is already selected,deselect  (toggle)
                if(allNums[i].classList.contains("selected")){
                    allNums[i].classList.remove("selected");
                    selectedNum = null;
                }
                else                    
                {                                       //Deselect all other numbers
                    for(var j=0;j<9;j++){
                        allNums[j].classList.remove("selected"); 
                    }

                    //Select the number and update
                    allNums[i].classList.add("selected");
                    selectedNum = allNums[i];

                    updateMove();

                }
            }
          });
      }
  }

  function startGame(){
      // Choose board difficulty
      let board;
      var easyDifficulty = document.getElementById("diff-1");
      var mediumDifficulty = document.getElementById("diff-2");
      if(easyDifficulty.checked)
      board = easy[0];
      else if(mediumDifficulty.checked)
      board = medium[0];
      else
      board = hard[0];

      //Set lives to 3 and enable selecting numbers and tiles
      lives = 3;
      disableSelect = false;        //that means we are able to select tyles

      document.getElementById("lives").textContent = "Lives Remaining: "+lives;

      //create board based on difficulty
      generateBoard(board);

      //starts the timer
      startTimer();
      //sets the theme
      let theme1 = document.getElementById("theme-1");
      if(theme1.checked){
        document.querySelector("body").classList.remove("dark");
      }                               
      else{
        document.querySelector("body").classList.add("dark");
        document.querySelector("footer").style.background ="white";
        document.querySelector("footer").style.color ="black";
        let tiles = document.querySelectorAll(".tile");
        for(let i=0;i<tiles.length;i++){
            tiles[i].style.border = "1px solid white";
        }
      }

      //Show number container
      document.getElementById("number-container").classList.remove("hidden");
  }


  function startTimer()
  {
      //sets the reamining time based on input
      var time1 = document.getElementById("time-1");
      var time2 = document.getElementById("time-2");

      if(time1.checked)         //3min
      timeRemaining = 180;
      else if(time2.checked)    //5min
      timeRemaining = 300;
      else                      //10min
      timeRemaining = 600;
      
      document.getElementById("timer").textContent = timeConversion(timeRemaining);

      //sets the timer to update every second
      timer = setInterval(function(){
        timeRemaining--;
        if(timeRemaining===0){
            endGame();
        }
        document.getElementById("timer").textContent = timeConversion(timeRemaining);
      },1000);
  }

//converting seconds to MM:SS format
  function timeConversion(time)
  {
    let minutes = Math.floor(time/60);
    if(minutes<10) minutes = "0"+minutes;
    let seconds = time%60;
    if(seconds<10) seconds = "0"+seconds;
    return minutes +":"+ seconds;
  }

  function generateBoard(board)
  {
      //clear previous boards 
      clearPreviousBoard();
      // increment tile id's
      let idCount = 0;
      //create 81 tiles
      for(let i=0;i<81;i++)
      {
          //create new paragraph ele
          let tile = document.createElement("p");
          if(board.charAt(i)=="-")          //We have to add numbers => so add click event to tile
          {
                tile.addEventListener("click",function(){
                    //If selecting is not disabled
                    if(!disableSelect){
                        if(tile.classList.contains("selected")){        //tile is already selected,deselect (toggle)
                            tile.classList.remove("selected");
                            selectedTile = null;    
                        }
                        else{                                           //deselect all tiles and activate current tile
                            for(var j=0;j<81;j++){
                                document.querySelectorAll(".tile")[j].classList.remove("selected");
                            }
                            tile.classList.add("selected");
                            selectedTile = tile;
                            updateMove();
                        }
                    }
                });
          }
          else                              //already number is there we simply display
          {
            tile.textContent = board.charAt(i);
          }
          //Assign the tile id
          tile.id = idCount;
          idCount++;
          //Add tile class to all tiles
          tile.classList.add("tile");

          //Add thick border to 3rd row and 6th row => to do that add bottomBorder class to those tiles in 3rd amd 6th row
          if((tile.id>17 && tile.id<27) || (tile.id>44 && tile.id<54))
          {
                tile.classList.add("bottomBorder");   
          }

          //Add thick border to 3rd and 6th col
          if((tile.id+1)%9==3 || (tile.id+1)%9==6)
          {
                tile.classList.add("rightBorder");
          }

          //Add tile to board
          document.getElementById("board").appendChild(tile);
      }
    }

  function updateMove(){
        //If a tila and number is selected
      if(selectedTile && selectedNum)
      {
          selectedTile.textContent = selectedNum.textContent;   //place that number in that tile
        if(checkCorrect(selectedTile)){       //if the number matches the corresponding number in the solution
            selectedTile.style.background="lightgreen";
            //deselect the tiles
            selectedTile.classList.remove("selected");
            selectedNum.classList.remove("selected");
            //clear selected variables
            selectedNum = null;
            selectedTile = null;
            //check if board is completed
            if(checkDone()){
                endGame();
            }
        }
        else                                    //number doesnot match solution num
        {
            //disable selecting new numbers for one second
            disableSelect = true;
            //make the tile red color
            selectedTile.classList.add("incorrect");

            setTimeout(function(){
                lives--;                    //we incorrectly placed => so we lose 1 live
                //no lives left then game is over
                if(lives===0){
                    endGame();
                }
                else{
                    //update lives text
                    document.getElementById("lives").textContent = "Lives Remaining: "+lives;
                    //reenable selecting nums & tiles
                    disableSelect = false;
                }      
                
                //restore tile color from red to normal & remove selected from both
                selectedTile.classList.remove("incorrect");
                selectedTile.classList.remove("selected");
                selectedNum.classList.remove("selected");

                //clear tiles text & selected variables
                selectedTile.textContent = "";
                selectedNum = null;
                selectedTile = null;

            },1000);
         }
        }
    }

    function checkDone(){
        let tiles = document.querySelectorAll(".tile");
        for(let i=0;i<tiles.length;i++){
            if(tiles[i].textContent==="")
                return false;
        }
        return true;
    }

    function endGame()
    {
        //disable moves and stop the timer
        disableSelect = true;
        clearTimeout(timer);
        //Display win or loss
        if(lives===0 || timeRemaining===0){
            document.getElementById("lives").textContent = "You Lost!";
            document.getElementById("lives").style.color ="red";
        }
        else{
            document.getElementById("lives").textContent = "You won!";
            document.getElementById("lives").style.color ="green";
        }
    }




  function checkCorrect(tile){
        //set solution based on difficulty choosen
        let solution;
        if(document.getElementById("diff-1").checked)
            solution = easy[1];
        else if(document.getElementById("diff-2").checked)
            solution = medium[1];
        else
            solution = hard[1]; 

        //if tiles number equal to solutions number
        if(solution.charAt(tile.id)===tile.textContent){
            return true;
        }
        else{
            return false;
        }
  }

  function clearPreviousBoard(){
      //Access all of the tiles
      let tiles = document.querySelectorAll(".tile");
      //Remove each tile
      for(let i=0;i<tiles.length;i++)
      {
          tiles[i].remove();
      }
      //If there is a times => clear it
      if(timer)
      clearTimeout(timer);

      //Deselect any numbers
      let nums = document.getElementById("number-container").children ;
      for(let i=0;i<nums.length;i++)
      {
          nums[i].classList.remove("selected");      //removing selected class from all the numbers
      }

      //clear selected variables
      selectedTile=null;
      selectedNum=null;
  }