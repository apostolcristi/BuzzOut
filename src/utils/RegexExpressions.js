const RegexExpressions = {
  RomanianPhoneRegExpression: /^(0[1-9]([0-9]){8})?$/,
  RomanianPlateNumberRegExpression: /^(AB|AR|AG|BC|BH|BN|BT|BV|BR|BZ|CS|CL|CJ|CT|CV|DB|DJ|GL|GR|GJ|HR|HD|IL|IS|IF|MM|MH|MS|NT|OT|PH|SM|SJ|SB|SV|TR|TM|TL|VS|VL|VN|B)(-| )?([0-9]{2,3}(-| )?[A-Z]{3})$/,
  RomanianRedPlateNumberRegExpression: /^(AB|AR|AG|BC|BH|BN|BT|BV|BR|BZ|CS|CL|CJ|CT|CV|DB|DJ|GL|GR|GJ|HR|HD|IL|IS|IF|MM|MH|MS|NT|OT|PH|SM|SJ|SB|SV|TR|TM|TL|VS|VL|VN|B)(-| )?([0-9]{6})$/,
  ValidRomanianPlateNumberRegExpression: /^(AB|AR|AG|BC|BH|BN|BT|BV|BR|BZ|CS|CL|CJ|CT|CV|DB|DJ|GL|GR|GJ|HR|HD|IL|IS|IF|MM|MH|MS|NT|OT|PH|SM|SJ|SB|SV|TR|TM|TL|VS|VL|VN|B)(-| )?(([0-9]{2,3}(-| )?[A-Z]{3})|([0-9]{6}))$/,
  CountyRegExpression: /([0-9]| |-)/,
};

export default RegexExpressions;
