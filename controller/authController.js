require("dotenv").config();
const asyncHandler = require("express-async-handler");
const { Select, SelectStatement } = require("../repository/emsdb");
const { Encrypter } = require("../repository/cryptography");
const { DataModeling } = require("../repository/dbmodel");
const jwt = require("jsonwebtoken");

// @des Get user information
// @route POST /login
// @access Public
const login = asyncHandler(async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.json({
        msg: "All fields are required",
      });
    }

    Encrypter(password, (err, encrypted) => {
      if (err) {
        console.error(err);
        return res.json(JsonErrorResponse(er));
      }

      let sql = SelectStatement(
        `select
        mper.mp_id as mp_id,
        mp_employeeid,
        md_name as mp_departmentid,
        mp_name as mp_positionname,
        mp_accessid ,
        mp_fullname
        from 
        master_user
        inner join master_personel mper on mper.mp_id = mu_personelid
        inner join master_access on ma_id = mp_accessid
        inner join master_position mpos on mpos.mp_id = mp_positionid
        inner join master_department on md_id = mp_departmentid
        where mu_username = ? and mu_password=?`,
        [username, encrypted]
      );

      Select(sql, (err, result) => {
        let data = DataModeling(result, "mp_");
        if (err) {
          console.error(err);
          return res.json({
            msg: "error",
          });
        }

        if (result.length == 0) {
          return res.json({
            msg: "Unauthorized",
          });
        }

        const accessToken = jwt.sign(
          {
            UserInfo: {
              fullname: data[0].fullname,
              employeeid: data[0].employeeid,
              department: data[0].departmentid,
              posistion: data[0].posistionname,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "5m",
          }
        );

        const refreshToken = jwt.sign(
          {
            employeeid: data[0].employeeid,
          },
          process.env.REFRESH_TOKEN_SECRET,
          {
            expiresIn: "1d",
          }
        );

        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: 1000 * 60 * 60 * 24,
        });

        res.json({ accessToken });
      });
    });
  } catch (error) {
    res,
      json({
        msg: error,
      });
  }
});

// @des Refresh
// @route GET /auth/refresh
// @access Public
const refresh = asyncHandler(async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });
      console.log(decoded.employeeid);
      let sql = SelectStatement(
        `select
        mper.mp_id as mp_id,
        mp_employeeid,
        md_name as mp_departmentid,
        mp_name as mp_positionname,
        mp_accessid ,
        mp_fullname
        from 
        master_user
        inner join master_personel mper on mper.mp_id = mu_personelid
        inner join master_access on ma_id = mp_accessid
        inner join master_position mpos on mpos.mp_id = mp_positionid
        inner join master_department on md_id = mp_departmentid
        where mp_employeeid = ?`,
        [decoded.employeeid]
      );

      Select(sql, (err, result) => {
        const foundUser = result[0];

        if (!foundUser)
          return res.status(401).json({ message: "Unauthorized" });

        if (result.length === 0) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        const accessToken = jwt.sign(
          {
            UserInfo: {
              fullname: foundUser.fullname,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "5m",
          }
        );

        res.json({ accessToken });
      });
    })
  );
});

// @des logout
// @route POST /auth/logout
// @access Public
const logout = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.status(204);
  }
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ msg: "Cookie cleared" });
});

module.exports = {
  login,
  refresh,
  logout,
};
