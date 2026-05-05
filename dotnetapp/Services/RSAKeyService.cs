using System.Security.Cryptography;
using System.Text;
 
public class RSAKeyService
{
    private readonly RSA _rsa;
 
    public RSAKeyService()
    {
        _rsa = RSA.Create(2048);
    }
 
    public string GetPublicKey()
    {
        var publicKeyBytes = _rsa.ExportSubjectPublicKeyInfo();
        var pem = "-----BEGIN PUBLIC KEY-----\n" +
                  Convert.ToBase64String(publicKeyBytes, Base64FormattingOptions.InsertLineBreaks) +
                  "\n-----END PUBLIC KEY-----";
        return pem;
    }
 
    public string Decrypt(string encryptedBase64)
    {
        byte[] encryptedBytes = Convert.FromBase64String(encryptedBase64);
        byte[] decryptedBytes = _rsa.Decrypt(encryptedBytes, RSAEncryptionPadding.OaepSHA1);
        return Encoding.UTF8.GetString(decryptedBytes);
    }
}