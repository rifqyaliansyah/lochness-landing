// utils/commandExecutor.js

/**
 * Command executor untuk Windows CMD simulator
 * Mudah untuk menambah command baru
 */

// Database command yang tersedia
const commands = {
//     dir: {
//         description: 'Displays a list of files and subdirectories',
//         execute: () => `Volume in drive C has no label.
//  Volume Serial Number is 1234-5678

//  Directory of C:\\Users\\rifqy

// 12/28/2025  10:22 PM    <DIR>          .
// 12/28/2025  10:22 PM    <DIR>          ..
// 12/28/2025  10:22 PM    <DIR>          Documents
// 12/28/2025  10:22 PM    <DIR>          Downloads
// 12/28/2025  10:22 PM    <DIR>          Pictures
// 12/28/2025  10:22 PM    <DIR>          Desktop
// 12/28/2025  09:15 AM           142,336 resume.pdf
// 12/28/2025  03:42 PM             2,048 notes.txt
//                2 File(s)        144,384 bytes
//                6 Dir(s)  100,000,000,000 bytes free`
//     },

help: {
    description: 'Provides help information for available commands',
    execute: () => `Available Commands:

NAVIGATION:
HOME         Return to home page
ABOUT        Learn more about me
PROJECT      View my projects and works
CONTACT      Get in touch with me

SYSTEM:
HELP         Displays this help information
CLEAR        Clears the screen

UTILITIES:
ECHO         Displays messages
DATE         Displays the current date
TIME         Displays the current time
VER          Displays system version
WHOAMI       Displays user information
`
  },

    home: {
        description: 'Returns to the home page',
        execute: () => `Hello, welcome to my portfolio website. Type "help" to get started!`
    },

    about: {
        description: 'Learn more about me',
        execute: () => `Name: Rifqy

Programming Languages:
- Javascript
- Python
- PHP

Hobbies:
- Listen Music
- Play Games

Work Experience:
Company: Alkademi
Role: Internship
Period: Jul 2025 - Dec 2025`
    },

    project : {
        description: 'View my projects and works',
        execute: () => `
Frontend:
1. - Name: Lochness Terminal
   - Description: Terminal Simulator for Portfolio
   - URL: https://rifqyaliansyah.github.io/lochness-landing

2. - Name: Kata-Ku
   - Description: A simple platform to post and share words
   - URL: https://github.com/rifqyaliansyah/qwerty-landing.git

Backend:
1. - Name: Qwerty API
   - Description: API service for managing posts and data in Kata-Ku.
   - URL: https://github.com/rifqyaliansyah/qwerty-api.git

2. - Name: OVA Downloader API
   - Description: A web-based downloader for YouTube, Instagram, TikTok, and more.
   - URL: https://github.com/rifqyaliansyah/ova-downloader.git
`
    },

    contact: {
        description: 'Get in touch with me',
        execute: () => `Get in touch with me!

Github: https://github.com/rifqyaliansyah
Linkedin: https://www.linkedin.com/in/rifqy-aliansyah/
Instagram: https://www.instagram.com/rifqyaliansyah
Email: rifqyaliansyah1877@gmail.com`
    },

    // cls: {
    //     description: 'Clears the screen',
    //     execute: () => ({ clear: true })
    // },

    clear: {
        description: 'Clears the screen',
        execute: () => ({ clear: true })
    },

    // exit: {
    //     description: 'Exits the command interpreter',
    //     execute: () => 'Exiting...'
    // },

    echo: {
        description: 'Displays messages',
        execute: (args) => {
            if (!args || args.length === 0) {
                return 'ECHO is on.'
            }
            return args.join(' ')
        }
    },

    date: {
        description: 'Displays the current date',
        execute: () => {
            const now = new Date()
            return `The current date is: ${now.toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            })}`
        }
    },

    time: {
        description: 'Displays the current time',
        execute: () => {
            const now = new Date()
            return `The current time is: ${now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            })}`
        }
    },

    ver: {
        description: 'Displays the Windows version',
        execute: () => `Microsoft Windows [Version 10.0.26200.7462]`
    },

//     ipconfig: {
//         description: 'Displays network configuration',
//         execute: () => `Windows IP Configuration

// Ethernet adapter Ethernet:

//    Connection-specific DNS Suffix  . : 
//    IPv4 Address. . . . . . . . . . . : 192.168.1.100
//    Subnet Mask . . . . . . . . . . . : 255.255.255.0
//    Default Gateway . . . . . . . . . : 192.168.1.1`
//     },

    whoami: {
        description: 'Displays current user information',
        execute: () => `DESKTOP-PC\\rifqy`
    },

//     tree: {
//         description: 'Displays directory structure',
//         execute: () => `Folder PATH listing
// Volume serial number is 1234-5678
// C:.
// ├───Documents
// │   ├───Work
// │   └───Personal
// ├───Downloads
// ├───Pictures
// │   └───Vacation
// └───Desktop
//     └───Projects`
//     },

    // color: {
    //     description: 'Changes console colors (simulation)',
    //     execute: (args) => {
    //         if (!args || args.length === 0) {
    //             return 'Sets the default console foreground and background colors.\n\nCOLOR [attr]\n\n  attr        Specifies color attribute of console output'
    //         }
    //         return `Color changed to: ${args[0]}`
    //     }
    // },

    // title: {
    //     description: 'Sets the window title',
    //     execute: (args) => {
    //         if (!args || args.length === 0) {
    //             return 'Sets the window title for the command prompt window.\n\nTITLE [string]'
    //         }
    //         return `Title set to: ${args.join(' ')}`
    //     }
    // },

//     ping: {
//         description: 'Sends ICMP echo requests',
//         execute: (args) => {
//             const target = args && args.length > 0 ? args[0] : 'example.com'
//             return `Pinging ${target} [93.184.216.34] with 32 bytes of data:

// Reply from 93.184.216.34: bytes=32 time=12ms TTL=56
// Reply from 93.184.216.34: bytes=32 time=11ms TTL=56
// Reply from 93.184.216.34: bytes=32 time=13ms TTL=56
// Reply from 93.184.216.34: bytes=32 time=12ms TTL=56

// Ping statistics for 93.184.216.34:
//     Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
// Approximate round trip times in milli-seconds:
//     Minimum = 11ms, Maximum = 13ms, Average = 12ms`
//         }
//     },

//     systeminfo: {
//         description: 'Displays detailed configuration information',
//         execute: () => `Host Name:                 DESKTOP-PC
// OS Name:                   Microsoft Windows 10 Pro
// OS Version:                10.0.26200 Build 26200
// System Manufacturer:       Custom Build
// System Model:              AMD Ryzen 9
// Processor:                 AMD Ryzen 9 5900X
// Total Physical Memory:     32,768 MB
// Available Physical Memory: 16,384 MB`
//     }
}

/**
 * Execute command dengan parsing argumen
 * @param {string} input - Command input dari user
 * @returns {string|object} - Output command atau special instruction
 */
export const executeWindowsCommand = (input) => {
    if (!input || !input.trim()) {
        return ''
    }

    // Parse command dan arguments
    const parts = input.trim().split(/\s+/)
    const cmd = parts[0].toLowerCase()
    const args = parts.slice(1)

    // Check apakah command ada
    if (commands[cmd]) {
        return commands[cmd].execute(args)
    }

    // Command tidak ditemukan
    return `'${input}' is not recognized as an internal or external command,
operable program or batch file.`
}

/**
 * Get list semua command yang available
 * @returns {Array} - Array of command names
 */
export const getAvailableCommands = () => {
    return Object.keys(commands)
}

/**
 * Get deskripsi command
 * @param {string} cmd - Command name
 * @returns {string} - Command description
 */
export const getCommandDescription = (cmd) => {
    const command = commands[cmd.toLowerCase()]
    return command ? command.description : 'Command not found'
}

/**
 * Check apakah command valid
 * @param {string} cmd - Command to check
 * @returns {boolean}
 */
export const isValidCommand = (cmd) => {
    return commands.hasOwnProperty(cmd.toLowerCase())
}