/**
 * Created by rocke on 15-5-1.
 */

//APP_ID
var APP_ID = "189cf0d5-4bd9-4d3f-a65d-342adbea735b";
//APP_NAME
var APP_NAME = "MicoKit";

/*设备字典*/
//设备制造商
var devmanudic = "public.map.property.manufacturer";
//设备序列号
var devnumdic = "public.map.property.serial_number";
//设备名称
var devnamedic = "public.map.property.name";

//adc
//var adcdic = "public.map.service.adc";
var adcdic = "public.map.service.light_sensor";
//RGB
var rgbdic = "public.map.service.rgb_led";
//uartmsg
var uartmsgdic = "public.map.property.message";
//温度传感器
var tempdic = "public.map.service.temperature";
//湿度传感器
var humidic = "public.map.service.humidity";
//距离传感器
var pro_sensordic = "public.map.service.proximity_sensor";
//大气压传感器
var atmo_sensordic = "public.map.service.atmosphere_sensor";
//三轴加速传感器
var montion_sensordic = "public.map.service.montion_sensor";
//电机
var motor_sensordic = "public.map.service.motor";
//红外
var infraeddic = "public.map.service.infrared";
//串口透传
var uartmsg = "public.map.service.uart";

//LED 的开关量
var rgbswitchdic = "public.map.property.switch";
//LED 颜色的 hues 分量
var rgbhuesdic = "public.map.property.hues";
//LED 颜色的 saturability分量
var rgbsatudic = "public.map.property.saturation";
//LED颜色的brightness分量
var rgbbrightdic = "public.map.property.brightness";
//all value
var othervaldic = "public.map.property.value";

//key对应的设备上报的标识
//adc标识
var adckey;
//uart标识
var uartkey;
//rgb标识switch
var rgbswikey;
//rgb标识hues
var rgbhueskey;
//urgb标识saturation
var rgbsatukey;
//rgb标识brightness
var rgbbrigkey;
//motor标识开关
var motorkey;
//infrared标识开关
var infraredkey;
//htkey
var temp_key;
//htkey
var humi_key;
//距离
var pro_key;
//大气压
var atmo_key;
//三轴加速
var montion_key;


////key对应的设备上报的标识
////adc标识
//var adckey = "10";
////uart标识
//var uartkey = "13";
////rgb标识switch
//var rgbswikey = "5";
////rgb标识hues
//var rgbhueskey = "6";
////urgb标识saturation
//var rgbsatukey = "7";
////rgb标识brightness
//var rgbbrigkey = "8";
////motor标识开关
//var motorkey = "15";
////infrared标识开关
//var infraredkey = "16";
////htkey
//var ht_key = "";
////距离
//var pro_key = "";
////大气压
//var atmo_key = "";
////三轴加速
//var montion_key = "";
