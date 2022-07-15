FROM ubuntu

ENV DEBIAN_FRONTEND=noninteractive
ENV PATH "$PATH:/workspaces/rewax"
ENV PATH "$PATH:/workspaces/rewax/waxclassic"
RUN apt update
RUN apt upgrade -y
RUN apt install -y g++ npm nodejs libjack-jackd2-dev python-is-python3 git time libwebkit2gtk-4.0-dev
RUN npm install -g typescript
