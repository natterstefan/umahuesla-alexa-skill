repositories {
    jcenter()
}

val envDir = project.file("v")
val binDir = envDir.resolve("bin")
val pip = binDir.resolve("pip")
val python = binDir.resolve("python")

tasks {

    val venv by creating {
        group = "Bootstrap"
        description = "Bootstraps a python virtual environment"
        val pipConf = envDir.resolve("pip.conf")

        outputs.files(pip, python, pipConf)
        doLast {
            exec {
                commandLine("python3", "-m", "venv", "--clear", envDir)
            }
            exec {
                commandLine(
                    pip, "install", "--upgrade",
                    "pip==9.0.1",
                    "setuptools==36.6.0",
                    "pip-tools==1.10.1"
                )
            }
        }
    }

    val sdist by creating {
        dependsOn(venv)
        inputs.files(fileTree("src"))
        val out = buildDir.resolve("sdist")
        outputs.dir(out)
        out.deleteRecursively()
        doLast {
            exec {
                commandLine(python, "setup.py", "sdist", "--dist-dir", out)
            }
        }
    }

    val dev by creating {
        group = "Bootstrap"
        description = "Installs all project dependencies into the venv"
        dependsOn(venv)
        val req_file = file("requirements.txt")
        val setup_file = file("setup.py")
        inputs.files(req_file, setup_file)
        // use pserve script as a marker
        outputs.file(binDir.resolve("pserve"))
        doLast {
            exec {
                commandLine(binDir.resolve("pip-sync"), req_file)
            }
            exec {
                commandLine(
                    pip, "--disable-pip-version-check",
                    "install", "--no-deps", "-e", projectDir
                )
            }
        }
    }

    val download_sdists by creating {
        description = "Download source dist python deps to use in docker build"
        group = BasePlugin.BUILD_GROUP
        val out = project.buildDir.resolve("pypi")
        outputs.dir(out)
        dependsOn(venv)
        doLast {
            // ensure there are no obsolete files in the directory
            delete { out }
            exec {
                commandLine(
                    "v/bin/pip", "download", "--no-deps", "--no-binary=:all:",
                    "-d", out, "-r", buildDir.resolve("private_packages.txt")
                )
            }
        }
    }

}

task(name = "wrapper", type = Wrapper::class) {
    gradleVersion = "4.7"
}
