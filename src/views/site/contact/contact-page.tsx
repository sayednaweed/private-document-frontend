export default function ContactPage() {
  return (
    <section className="mb-32">
      <div
        id="map"
        className="relative h-[300px] overflow-hidden bg-cover bg-[50%] bg-no-repeat"
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3286.669941787271!2d69.18888467450978!3d34.53658929200287!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38d16ea791269fcf%3A0xda151ef48dbd8e66!2sMinistry%20of%20Public%20Health!5e0!3m2!1sen!2s!4v1726373967529!5m2!1sen!2s"
          width="100%"
          height="480"
        ></iframe>
      </div>
      <div className="container px-6 md:px-12">
        <div className="block rounded-lg bg-[hsla(0,0%,100%,0.8)] px-6 py-12 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]  md:py-16 md:px-12 -mt-[100px] backdrop-blur-[30px] border border-gray-300">
          <div className=" text-center font-bold text-2xl rounded-md bg-sky-200 p-4 text-primary mb-5">
            Contact Us
          </div>
          <div className="flex flex-wrap">
            <div className="mb-12 w-full shrink-0 grow-0 basis-auto md:px-3 lg:mb-0 lg:w-5/12 lg:px-6">
              <div className="ml-6 grow">
                <p className="mb-2 font-bold ">Director Stuff </p>
                <p className="mb-2 font-bold  text-neutral-500">Director</p>
                <p className="text-sm text-neutral-500">Name: Naweed Sayedi</p>
                <p className="text-sm text-neutral-500">Job: Director of IRd</p>
                <p className="text-sm text-neutral-500">
                  Phone:+93(0)77564323{" "}
                </p>
                <p className="text-sm text-neutral-500">
                  Email:Naweedsayedi@gmail.com{" "}
                </p>
              </div>
            </div>
            <div className="w-full shrink-0 grow-0 basis-auto lg:w-7/12">
              <div className="flex flex-wrap">
                <div className="mb-12 w-full shrink-0 grow-0 basis-auto md:w-6/12 md:px-3 lg:w-full lg:px-6 xl:w-6/12">
                  <div className="flex items-start">
                    <div className="shrink-0"></div>
                    <div className="ml-6 grow">
                      <p className="mb-2 font-bold ">Administrative Stuff </p>
                      <p className="mb-2 font-bold  text-neutral-500">
                        Maneger
                      </p>
                      <p className="text-sm text-neutral-500">
                        Name: Imran Orya
                      </p>
                      <p className="text-sm text-neutral-500">
                        Job: Maneger of IRD
                      </p>
                      <p className="text-sm text-neutral-500">
                        Phone:+93(0)77889933
                      </p>
                      <p className="text-sm text-neutral-500">
                        Email: imranorya@gmail.com
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mb-12 w-full shrink-0 grow-0 basis-auto md:w-6/12 md:px-3 lg:w-full lg:px-6 xl:w-6/12">
                  <div className="flex items-start">
                    <div className="ml-6 grow">
                      <p className="mb-2 font-bold ">Technical support</p>
                      <p className="text-sm text-neutral-500">
                        <div className="relative rounded-xl overflow-auto p-8">
                          <div className="flex justify-center -space-x-3 font-mono text-white text-sm font-bold leading-6">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-pink-500 shadow-lg ring-2 ring-white z-40 dark:ring-slate-900">
                              <img
                                className="size-14  rounded-full z-30"
                                src="src/assets/ground.jpg"
                                alt="image"
                              />
                            </div>
                            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-pink-500 shadow-lg ring-2 ring-white z-30 dark:ring-slate-900">
                              <img
                                className="size-14  rounded-full z-30"
                                src="src/assets/ground.jpg"
                                alt="image"
                              />
                            </div>
                            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-pink-500 shadow-lg ring-2 ring-white z-20 dark:ring-slate-900">
                              <img
                                className="size-14  rounded-full z-30"
                                src="src/assets/ground.jpg"
                                alt="image"
                              />
                            </div>
                            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-pink-500 shadow-lg ring-2 ring-white z-10 dark:ring-slate-900">
                              <img
                                className="size-14  rounded-full z-30"
                                src="src/assets/ground.jpg"
                                alt="image"
                              />
                            </div>
                          </div>
                        </div>
                        <br />
                        <br />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
