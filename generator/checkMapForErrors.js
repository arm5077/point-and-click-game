module.exports = async (data) => {
  data.rooms.forEach(room => {
    for (roomId of Object.keys(room.exits)) {
      if (!data.rooms.find(r => r.id === roomId)) {
        delete room.exits.roomId;
      }
    }  
  });

  return data;
}