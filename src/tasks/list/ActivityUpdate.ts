import dayjs from "dayjs";
import { User } from "discord.js";
import Client from "../../client/Client";
import ChannelIDs from "../../constants/ChannelIDs";
import Member from "../../database/member/Member";
import MemberActivity from "../../database/member/MemberActivity";
import ServerActivity from "../../database/ServerActivity";
import Task from "../Task"

export default class ServerActivityUpdate extends Task {

    private vocalInLastMinute: User[] = [];

    constructor(){
        super(60000 /* 1 minute */);
    }

    public async run(timeout: NodeJS.Timeout) : Promise<void> {
        // Reset message of the month :
        if(dayjs().format("DD-HH-mm") === "01-00-00"){
            Client.instance.database.createQueryBuilder().update(MemberActivity).set({voiceMinute: 0}).execute();
        }

        // Get server activity :
        const serverActivity = await ServerActivity.getServerActivity();

        // Update daily member count :
        if(Client.instance.getGuild().memberCount > serverActivity.memberCount){
            serverActivity.memberCount = Client.instance.getGuild().memberCount;
        }

        // Update voice time (member, server global) :
        for(let i = this.vocalInLastMinute.length; i > 0; i--){
            serverActivity.voiceMinute++;
            
            let user = this.vocalInLastMinute.shift();

            if(user){
                let member = await Member.getMember(user);

                member.activity.voiceMinute++;
                member.save();
            }
        }

        Client.instance.getGuild().voiceStates.cache.forEach(voiceState => {
            if(voiceState.member && !voiceState.member.user.bot && !voiceState.selfMute && voiceState.channel?.id !== ChannelIDs.afk){
                this.vocalInLastMinute.push(voiceState.member.user);
            }
        });

        // Save data :
        serverActivity.save();
    }
}