function Validator (formSelector) {
    var _this=this;
    function getParent(element,selector) {
        while (element.parentElement) {
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }else {
                element=element.parentElement;
            }
        }
    }
    var formRules= {};
    var validatorRules = {
        required: function(value) {
            return value? undefined: "Vui lòng nhập trường này";
        },
        email: function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined: 'Trường này phải là email';
        },
        min: function(min) {
            return function(value){
                return value.length>=min? undefined: `Vui lòng nhập tối thiểu ${min} kí tự`;
            }
        }
    }
    //lấy ra form element trong DOM theo formSelector
    var formElement = document.querySelector(formSelector);
    //Chỉ xử lí khi có Element trong DOM
    if(formElement) {
        var inputs = formElement.querySelectorAll('[name][rules]');
        for (var input of inputs){
            var rules=input.getAttribute('rules').split('|');
            for(var rule of rules){
                var ruleInfo;
                var isRuleHasvalue = rule.includes(':');
                if(isRuleHasvalue){
                    ruleInfo=rule.split(':');
                    rule= ruleInfo[0];
                }
                var ruleFun = validatorRules[rule];
                if(isRuleHasvalue){
                    ruleFun = ruleFun(ruleInfo[1])
                }
                if (Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFun);
                }else{
                    formRules[input.name]= [ruleFun];
                }
                
            }
            input.onblur=handleValidate;
            input.oninput=handClearError;
        }
        //lắng nghe sự kiện để validate
        function handleValidate(event) {
            //console.log(event.target.value);
            var rules = formRules[event.target.name];
            var errorMessage;
            for(var i=0;i<rules.length;++i){
                errorMessage=rules[i](event.target.value);
                if(errorMessage)
                    break;
            }
            // for(var rule of rules){
            //     errorMessage= rule(event.target.value);
            //     if(errorMessage)
            //         break;
            // }
            //cách 2
            // rules.find(function (rule){
            //     errorMessage= rule(event.target.value);
            //     return errorMessage;
            // });
            //console.log(errorMessage);
            
            if(errorMessage) {
                var formGroup=getParent(event.target,'.form-group');
                if(formGroup){
                    formGroup.classList.add('invalid');
                    var formMessage =formGroup.querySelector('.form-message');
                    if(formMessage) {
                        formMessage.innerText = errorMessage;
                    }
                }
            }
            return !errorMessage;
        }
        function handClearError(event) {
            var formGroup=getParent(event.target,'.form-group');
            if(formGroup.classList.contains('invalid')) {
                formGroup.classList.remove ('invalid');
                var formMessage =formGroup.querySelector('.form-message');
                if(formMessage) {
                    formMessage.innerText = '';
                }
            }
        }

    }
    //xử lí hành vi submit form
    formElement.onsubmit= function(event) {
        event.preventDefault();
        var inputs = formElement.querySelectorAll('[name][rules]');
        var isValid= true;
        for (var input of inputs) {
            if(!handleValidate({target: input})) {
                isValid=false; 
            }
            
        }
        //khi không có lỗi thì submit form
        if(isValid) {
            if(typeof _this.onSubmit==='function'){
                var enableInput = formElement.querySelectorAll('[name]');
                    var formValues= Array.from(enableInput).reduce(function(values,input){
                        switch(input.type) {
                            case 'radio':
                                if(input.matches(':checked')) {
                                    values[input.name]=input.value;break;
                                }
                                break;
                            case 'checkbox':
                                if(!input.matches(":checked")){
                                    values[input.name]='';
                                    return values;
                                }
                                if(!Array.isArray(values[input.name])){
                                    value[input.name]=[];
                                }
                                values[input.name].push(input.value);
                                break;
                            case 'file':
                                values[input.name]= input.files;
                                break;
                            default :
                                values[input.name]=input.value;
                        }
                        return values;
                    },{});
                    _this.onSubmit(formValues);
            }else{
                formElement.submit();
            }
        }
    }
}