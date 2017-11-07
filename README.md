#Mountain Fortress


###To do's / Ideas:

####Art
Basic sprite sheet

Map out necessary art / background tiles

look into animating rain on tiles

####Map
Create map prototypes for first section

Bring in code for camera following player and animated (sliding) movement, bridge both

Doors and keys?

####Dialog
Create dialog substate during player (obscures part of the map, pauses the game effectively, and limits player input)

####Inventory
Clickable inventory? Draggable?

Hit testing for point to rect and rect to rect

####State
load and unload sections so that entire game doesn't have to be in memory

create scenes and levels more dynamically

####Play
Monster movement, following player based on visibility

Monster generation off camera

Item generation, on dungeon and on monsters?

####Misc
Health bar

####Prerecorded movement
Player input should not directly move the player but should fire an action that will then cause the player to move.
In this way a set of prerecorded movements can be defined for cinematic scenes

####Cinematic scenes
Cuts away from game play to show some exposition
