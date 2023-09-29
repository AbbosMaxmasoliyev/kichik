async function fetchData() {
    var myHeaders = new Headers();
    myHeaders.append(
        "Authorization",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MTU1NzUzMDhkYzY0MDNjNzM1NmY0NSIsImlhdCI6MTY5NTg5NzUwOX0.NHotyJ2YIqHogyyA8PHO_PeAMl5bJhnIQihTMZiZBeY"
    );

    var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    return fetch("http://194.163.142.231:3000/admin/product/list", requestOptions)
        .then((response) => response.json())
        .then((result) => {
            return result;
        })
        .catch((error) => {
            console.log("error", error);
            return null;
        });
}


fetchData()
    .then(async (data) => {
        if (data !== null) {
            let users = await getUser().then(data => {
                if (data !== null) {
                    let obj = {}
                    data.map((item) => {
                        let id = item.id
                        obj[id] = item
                    })
                    return obj
                }
            })
            if (users != null) {

                console.log(data);
                console.log(users);
                data.forEach((item) => {
                    createTable("#productTable", "plus", item, users)
                })
            }
        } else {
            console.log("Ma'lumot olishda xatolik yuz berdi.");
        }
    });

async function getUser() {
    return await fetch("http://194.163.142.231:3000/admin/users/list", {
        headers: {
            'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MTU1NzUzMDhkYzY0MDNjNzM1NmY0NSIsImlhdCI6MTY5NTk3MjI1OX0.WpMNgS488yXva5gK8SefQ16l5wrIr3CJwPNcRj457-M'
        }
    }).then(res => res.json()).then(data => { return data })
}







function createTable(selector, type, obj, users) {
    if (type === "plus") {
        document.querySelector(selector).innerHTML += `<tr>
        <td>${users[obj.owner_id].first_name + " " + users[obj.owner_id].last_name}</td>
        <td>${obj.name_lat}</td>
        <td>${new Date(obj.created_at).getHours() + "." + new Date(obj.created_at).getDate() + "." + new Date(obj.created_at).getFullYear()}</td>
        <td>${obj.price}$</td>
        <td>${obj.is_deleted ? "Selling" : "Time Out"}</td>
        <td class="btn">
            <button onclick="setActive(this)"><img src="img/fi_settings.png"></button>
            <div class="set">
                <button class="check" onclick="check('yes', '${obj.id}')"></button>
                <button class="notChecked" onclick="check('not',  '${obj.id}')"></button>
            </div>

            <button onclick="deleteItem('${obj.id}', this)" class="img"> <img src="img/delete.png"></button>
        </td>

    </tr>`
    }
}

function setActive(event) {
    // console.log(document.querySelector(".setActive").classList);
    classRemove(".setActive", "setActive")

    event.parentElement.children[1].classList.add("setActive")
}


function classRemove(selector, className) {
    if (document.querySelector(selector)) {
        document.querySelector(selector).classList.remove(className)
    }
}


function check(type, id) {
    if (type === "yes" || type === "not") {
        fetch(`http://194.163.142.231:3000/product/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ is_deleted: type == "yes" ? true : false }),
            headers: {
                "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MTU1NzUzMDhkYzY0MDNjNzM1NmY0NSIsImlhdCI6MTY5NTk3MjI1OX0.WpMNgS488yXva5gK8SefQ16l5wrIr3CJwPNcRj457-M"
            }
        }).then(res => res.json()).then(data => {
            if (data !== null) {
                classRemove(".setActive", "setActive")
            }
        }).catch(err => console.log(err))
    }
}

function deleteItem(id, event) {
    let element = event.parentElement.parentElement
    fetch(`http://194.163.142.231:3000/product/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MTU1NzUzMDhkYzY0MDNjNzM1NmY0NSIsImlhdCI6MTY5NTk3MjI1OX0.WpMNgS488yXva5gK8SefQ16l5wrIr3CJwPNcRj457-M"
        }
    }).then(res => res.json()).then(data => {
        if (data !== null) {

            document.querySelector("#productTable").removeChild(element)
        }
    }).catch(err => console.log(err))

}