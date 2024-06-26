const dataSchema = require("../manager/Database/data_schema");

const moment = require("moment");
moment.locale("tr");

const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, AttachmentBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("kodlar")
		.setDescription("Oluşturulan kodları listeler.")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async Init(interaction) {

		let data = await dataSchema.find();
		if (!data || !data.length) return interaction.reply({ content: `${emoji.cancel} Oluşturulan teslimat kodu bulunmamaktadır.`, ephemeral: true });

		let list = data.map((x, index) => `${index + 1}. \`${x.deliveryCode}\` - [**${interaction.guild.members.cache.get(x.creatorID).user.username}** ${Number(x.owoCash).toLocaleString()} cash]`).join("\n");

		const txtRow = new ActionRowBuilder()
			.addComponents(
					new ButtonBuilder()
						.setCustomId("txt_stock_codes")
						.setStyle(ButtonStyle.Primary)
						.setLabel("TXT Oluştur")
			);

		const infoEmbed = new EmbedBuilder()
			.setTitle("Kodlar Aşağıda Listelendi")
			.setColor("Random")
			.setDescription(list);

		interaction.reply({ content: `Oluşturulan **${data.length}** adet teslimat kodu aşağıda listelendi.`, embeds: [infoEmbed], components: [txtRow] })
			.then((msg) => {

				var filter = (interaction) => interaction.member.id == interaction.user.id;
				const collector = msg.createMessageComponentCollector({ filter });

				collector.on("collect", async interaction => {

					if (interaction.customId === "txt_stock_codes") {

						let stockCodes = await data.map((x) => `Teslimat Kodunuz: ${x.deliveryCode}`).join("\n");

						interaction.reply({ content: `Toplu Stok işlemi için **${data.length}** adet teslimat kodu metin belgesine aktarıldı.`, files: [{ attachment: Buffer.from(stockCodes), name: "codes.txt" }] });

					};

				});

			});

	}
}