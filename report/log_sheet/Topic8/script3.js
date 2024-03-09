/* in disco.js */

// light plate for showing lyrics
class LightPlate {
  #lyrics = [];
  #loadedTable;
  /* code skipped */

  constructor(x, y) {
    this.#loadedTable = loadTable("../assets/lyric.csv", "csv", () =>
      this.onFileload()
    );
  }

  // load in lyrics from csv file
  onFileload() {
    for (let row = 1; row < this.#loadedTable.getRowCount(); row++)
      for (
        let column = 1;
        column < this.#loadedTable.getColumnCount();
        column++
      )
        this.#lyrics.push({
          time: this.#loadedTable.getString(row, 0),
          lyric: this.#loadedTable.getString(row, 1),
        });
  }
}
