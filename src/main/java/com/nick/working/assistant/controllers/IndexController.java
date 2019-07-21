package com.nick.working.assistant.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Controller
public class IndexController {
    @RequestMapping("/**/{path:[^\\.]+}")
    public String index() {
        return home();
    }

    @RequestMapping("/")
    public String home() {
        return "forward:/built/index.html";
    }
}
