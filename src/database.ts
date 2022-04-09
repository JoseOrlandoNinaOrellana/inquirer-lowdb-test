import lowdb from "lowdb";
import FileSync from "lowdb/adapters/FileSync";

interface schema {
    playlists: PlaylistJSON[],
}

export type SongJSON = 
{
    name: string,
    author: string,
    duration: number,
    genre: string,
    single: boolean,
    numberRepro: number,
}



export class PlaylistJSON {
    constructor(public name: string, public songs: string[], public duration: number, public genres: string[]) {}

    async addSong(nameSong: string) {
        this.songs.push(nameSong);
    }

    removeSong(nameSong: string) {
        let index = this.songs.indexOf(nameSong);
        this.songs.splice(index, 1);
    }
}

export class Database {
    private database: lowdb.LowdbSync<schema>;

    constructor() {
        this.database = lowdb(new FileSync("db.json"));
        this.database.defaults({ playlists: [] }).write();
    }

    setPlaylist(playlist: PlaylistJSON) {
        this.database.get("playlists").push(playlist).write();
    }

    setSongToPlaylist(namePlaylist: string, nameSong: string) {
        let index: number = Number(this.database.get("playlists").findIndex(playlist => playlist.name === namePlaylist));
        this.database.get("playlists").value().at(index)?.songs.push(nameSong);
        //this.database.get("playlists").value().at(index)?.addSong(nameSong); //Da error al usar la funcion addSong
        this.database.write();
    }

    removeSongFromPlaylist(namePlaylist: string, nameSong: string) {
        let index: number = Number(this.database.get("playlists").findIndex(playlist => playlist.name === namePlaylist));
        let indexSong = this.database.get("playlists").value()[index].songs.indexOf(nameSong);
        this.database.get("playlists").value()[index].songs.splice(indexSong, 1);
        this.database.write();
    }

    getPlaylist(namePlaylist: string): PlaylistJSON {
        return this.database.get("playlists").find({ name: namePlaylist }).value();
    }

    removePlaylist(namePlaylist: string) {
        let index: number = Number(this.database.get("playlists").findIndex(playlist => playlist.name === namePlaylist));
        this.database.get("playlists").splice(index, 1).write();
    }

    viewPlaylists() {
        this.database.get("playlists").value().forEach((playlist: PlaylistJSON) => {
            console.log(playlist.name);
        })
    }

    viewPlaylist(namePlaylist: string) {
        let index: number = Number(this.database.get("playlists").findIndex(playlist => playlist.name === namePlaylist));

        console.log("[" + namePlaylist +"]");
        this.database.get("playlists").value().at(index)?.songs.forEach((song: string) => {
            console.log(song);
        })
    }
}