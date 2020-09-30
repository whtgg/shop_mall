import CryptoJS from 'crypto-js'
export default {//加密
  encrypt(word, keyStr){ 
    
      var key  = CryptoJS.enc.Latin1.parse(keyStr);//Latin1 w8m31+Yy/Nw6thPsMpO5fg==
      var encrypted = CryptoJS.AES.encrypt(word, key, {iv:key,mode:CryptoJS.mode.CBC,padding: CryptoJS.pad.ZeroPadding});
      
    return encrypted.toString();
  },
  //解密
  decrypt(word, keyStr){  
    keyStr = keyStr ? keyStr : 'thanks,vtrace123';
    var key  = CryptoJS.enc.Utf8.parse(keyStr);//Latin1 w8m31+Yy/Nw6thPsMpO5fg==
    var decrypt = CryptoJS.AES.decrypt(word, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
  }

}