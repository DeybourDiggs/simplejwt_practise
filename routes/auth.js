const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const { users } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post(
  "/signup",
  [
    check("email", "Please provide a valid email").isEmail(),
    check("password", "Password length should be greater than 6").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    const { password, email } = req.body;

    // VALIDATE OUR INPUTS
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    //VALIDATE IF USER DOESNT EXISTS

    let user = users.find((user) => {
      return user.email === email;
    });

    if (user) {
      return res.status(400).json({
        errors: [
          {
            msg: "This user already exixts",
          },
        ],
      });
    }

    let hashedPassword = await bcrypt.hash(password, 10);

    users.push({
      email,
      password: hashedPassword,
    });
    const token = await jwt.sign(
      {
        email,
      },
      "hdhdgshsgtedgsytwt",
      {
        expiresIn: 3600000,
      }
    );
    res.json({
      token,
    });
  }
);

router.post("/login", async (req, res) => {
  const { password, email } = req.body;

  let user = users.find((user) => {
    return user.email === email;
  });

  if (!user) {
    return res.status(400).json({
      errors: [
        {
          msg: "Invalid Credentials",
        },
      ],
    });
  }

  let isMatcth = await bcrypt.compare(password, user.password);

  if (!isMatcth) {
    return res.status(400).json({
      errors: [
        {
          msg: "Invalid credentials",
        },
      ],
    });
  }

  const token = await jwt.sign(
    {
      email,
    },
    "hdhdgshsgtedgsytwt",
    {
      expiresIn: 3600000,
    }
  );
  res.json({
    token,
  });
});

router.get("/all", (req, res) => {
  res.json(users);
});

module.exports = router;
