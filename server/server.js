require("dotenv").config();

const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hello World",
  });
});

app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    res.status(200).send({
      bot: response.data.choices[0].text,
    });

    // append AI respnse to aiResponse.txt file
    const fs = require("fs");
    fs.appendFile(
      "aiResponse.txt",
      response.data.choices[0].text,
      function (err) {
        if (err) throw err;
        console.log("Saved response!");
      }
    );
  } catch (error) {
    console.log("ERROR: " + error);
    res.status(500).send({ error });
  }
});

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
