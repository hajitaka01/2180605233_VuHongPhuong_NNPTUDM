var express = require('express');
var router = express.Router();
let userController = require('../controllers/users');
const { check_authentication, check_authorization } = require('../Utils/check_auth');
const constants = require('../Utils/constants');



router.post('/signup', async function(req, res, next) {
    try {
        let body = req.body;
        let result = await userController.createUser(
          body.username,
          body.password,
          body.email,
         'user'
        )
        res.status(200).send({
          success:true,
          data:result
        })
      } catch (error) {
        next(error);
      }

})
router.post('/login', async function(req, res, next) {
    try {
        let username = req.body.username;
        let password = req.body.password;
        let result = await userController.checkLogin(username,password);
        res.status(200).send({
            success:true,
            data:result
        })
      } catch (error) {
        next(error);
      }

})
router.get('/me',check_authentication, async function(req, res, next){
    try {
      res.status(200).send({
        success:true,
        data:req.user
    })
    } catch (error) {
        next();
    }
})

// Route để reset password (chỉ admin có quyền)
router.get('/resetPassword/:id', check_authentication, 
  check_authorization(constants.ADMIN_PERMISSION), async function(req, res, next) {
  try {
      let result = await userController.resetPassword(req.params.id);
      res.status(200).send({
          success: true,
          message: "Đã reset mật khẩu thành công",
          data: { userId: result._id }
      });
  } catch (error) {
      next(error);
  }
});

// Route để thay đổi mật khẩu (người dùng đã đăng nhập)
router.post('/changePassword', check_authentication, async function(req, res, next) {
  try {
      let { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
          throw new Error("Thiếu thông tin mật khẩu hiện tại hoặc mật khẩu mới");
      }
      
      let result = await userController.changePassword(req.user._id, currentPassword, newPassword);
      
      res.status(200).send({
          success: true,
          message: "Đã thay đổi mật khẩu thành công"
      });
  } catch (error) {
      next(error);
  }
});
module.exports = router