import inquirer, { Inquirer, PromptModule} from "inquirer";
import { Database, PlaylistJSON, SongJSON } from "./database";

let d: Database = new Database();

enum Commands {
    SelectPlatlist = "Select playlist",
    AddPlaylist = "Add playlist",
    RemovePlaylist = "Remove playlist",
    Quit = "Quit",
}

enum CommandsPlaylist {
    AddSong = "Add song to a playlist",
    RemoveSong = "Remove song from a playlist",
    Quit = "Quit",
}

async function promptUser(): Promise<void> {
    let answers = {
        command: Commands.SelectPlatlist,
    }

    while(answers["command"] != Commands.Quit)
    {
        console.clear();
        d.viewPlaylists();
        answers = await inquirer.prompt({
            type: "list",
            name: "command",
            message: "Choose option",
            choices: Object.values(Commands)
        });

        switch(answers["command"]) {
            case Commands.SelectPlatlist:
                await promptSelectPlaylist();
                break;
            case Commands.AddPlaylist:
                await promptAddPlaylist();
                break;
            case Commands.RemovePlaylist:
                await promptRemovePlaylist();
                break;
        }
    }
}

async function promptUserPlaylist(namePlaylist: string): Promise<void> {
    let answers = {
        commandPlaylist: CommandsPlaylist.AddSong,
    }

    while(answers["commandPlaylist"] != CommandsPlaylist.Quit) {
        console.clear();
        d.viewPlaylist(namePlaylist);
        const answers = await inquirer.prompt({
            type: "list",
            name: "commandPlaylist",
            message: "Choose option",
            choices: Object.values(CommandsPlaylist)
        });

        switch(answers["commandPlaylist"]) {
            case CommandsPlaylist.AddSong:
                await promptAddSong(namePlaylist);
                break;
            case CommandsPlaylist.RemoveSong:
                await removeSong(namePlaylist);
                break;
            case CommandsPlaylist.Quit:
                console.log("ee");
                break;
        }

        if(answers["commandPlaylist"] === CommandsPlaylist.Quit)
            break;
    }
}

async function promptAddSong(namePlaylist: string) {
    console.clear();
    
    const nameSong = await inquirer.prompt({
        type: "input",
        name: "nameSong",
        message: "Enter name of the song:",
    });

    d.setSongToPlaylist(namePlaylist, nameSong["nameSong"]);
}

async function removeSong(namePlaylist: string) {
    console.clear();
    
    const nameSong = await inquirer.prompt({
        type: "input",
        name: "nameSong",
        message: "Enter name of the song:",
    });

    d.removeSongFromPlaylist(namePlaylist, nameSong["nameSong"]);
}

async function promptSelectPlaylist(): Promise<void> {
    console.clear();

    const namePlaylist = await inquirer.prompt({
        type: "input",
        name: "namePlaylist",
        message: "Enter name of the playlist: ",
    });

    await promptUserPlaylist(namePlaylist["namePlaylist"]);
}

async function promptAddPlaylist(): Promise<void> {
    console.clear();
    
    const namePlaylist = await inquirer.prompt({
        type: "input",
        name: "namePlaylist",
        message: "Enter name of the playlist: ",
    });

    let newPlaylist = new PlaylistJSON (namePlaylist["namePlaylist"], [], 0, [])
    d.setPlaylist(newPlaylist);
}

async function promptRemovePlaylist(): Promise<void> {
    console.clear();
    
    const namePlaylist = await inquirer.prompt({
        type: "input",
        name: "namePlaylist",
        message: "Enter name of the playlist: ",
    });

    d.removePlaylist(namePlaylist["namePlaylist"]);
}

promptUser();