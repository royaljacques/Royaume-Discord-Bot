import { GuildMemberRoleManager, Interaction } from "discord.js";
import { simpleEmbed } from "$core/utils/Embed";
import Event, { EventName } from "$core/events/Event";
import { selectMenu } from "$resources/config/interaction-ids.json";
import { msg } from "$core/utils/Message";
import Logger from "$core/utils/Logger";
import { gameGuildId } from "$resources/config/information.json";

export default class RolesSelector extends Event {

  public readonly enabledInDev = false;

  public name: EventName = "interactionCreate";

  public async execute(interaction: Interaction): Promise<void> {
    if (interaction.guildId === gameGuildId) return;
    if (!interaction.isStringSelectMenu() || !interaction.customId.startsWith(selectMenu.rolesSelector)) return;

    // Get category :
    const category = interaction.customId.replace(`${selectMenu.rolesSelector}-`, "");

    // Get selected and un-selected roles :
    const selectedRoles = interaction.values;
    const unselectedRoles = interaction.component.options.map(option => option.value).filter(role => {
      return !selectedRoles.includes(role);
    });

    // Get member role manager :
    const memberRoles = interaction.member?.roles;

    if (!(memberRoles instanceof GuildMemberRoleManager)) {
      interaction.reply({ embeds: [simpleEmbed(msg("event-rolesselector-exec-roles-fetch-error"), "error")] });
      return;
    }

    // Add and remove selected/unselected roles :
    try {
      await memberRoles.add(selectedRoles);
      await memberRoles.remove(unselectedRoles);
    } catch (e) {
      Logger.error(`Error while updating member ${interaction.member?.user.id} roles : ${e}`);
    }

    // Send confirmation :
    interaction.reply({
      embeds: [simpleEmbed(msg("event-rolesselector-exec-roles-edited", [category]))],
      ephemeral: true
    });
  }

}