"use client";

import CommonButton from "@/components/common/CommonButton";
import Form from "@/components/common/Form";
import FormInput from "@/components/common/Form/FormInput";
import FormTextInput from "@/components/common/Form/FromTextInput";
import SectionHeader from "@/components/common/User/SectionHeader";
import { contactFormSchema } from "@/schemas/contactForm";
import { IOwner } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import {
  FaFacebook,
  FaGithub,
  FaLinkedin,
  FaMailBulk,
  FaPenAlt,
  FaPhone,
} from "react-icons/fa";
import { PiStackOverflowLogoFill } from "react-icons/pi";

const GetInTouch = ({
  ownerData,
  id = "",
}: {
  ownerData: IOwner;
  id?: string;
}) => {
  const onSubmit = async (data: any) => {
    console.log({ data });
    // try {
    //   // const res = await userLogin({ ...data }).unwrap();
    //   await addAcademicDepartment(data);
    //   message.success("Academic department added successfully");
    //   router.push("/admin/academic/department");
    // } catch (error: any) {
    //   console.log(error.message);
    //   message.error(error.message);
    // }
  };

  return (
    <section
      className="container mx-auto px-5 sm:px-10 md:px-0 xl:px-20 2xl:px-40 mt-40 mb-40"
      id={id}
    >
      <SectionHeader title="Get In Touch" classNames="text-center" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-5 gap-y-10 lg:gap-y-0">
        <div className="flex flex-col gap-y-8">
          <p className="text-lg text-lightText">
            If you want to know more about anything. You can contact with me.
            You can also give me opinion about my page. My inbox is always open
            for you. I will try my best to reply all of your message
          </p>

          <div className="flex flex-col gap-y-1">
            <p className="flex gap-x-2 items-center text-ternaryText font-semibold text-lg">
              <FaPenAlt /> {ownerData?.address}
            </p>
            <Link
              href={`https://mail.google.com/mail/u/0/?fs=1&to=${ownerData?.email}&tf=cm`}
              target="_blank"
              aria-label="Redirect to mail address"
            >
              <p className="flex gap-x-2 items-center text-ternaryText font-semibold text-lg">
                {" "}
                <FaMailBulk />
                {ownerData?.email}
              </p>
            </Link>
            <p className="flex gap-x-2 items-center text-ternaryText font-semibold text-lg">
              {" "}
              <FaPhone />
              {ownerData?.phoneNumber}
            </p>
          </div>

          {ownerData?.calanderlyUrl && (
            <div className="text-lg">
              <p className="text-lightText">Schedule a meeting:</p>
              <Link
                className="text-ternaryText"
                href={ownerData?.calanderlyUrl}
                target="_blank"
                aria-label="Redirect to calanderly"
              >
                {ownerData?.calanderlyUrl}
              </Link>
            </div>
          )}

          <div className="text-lg">
            <p className="text-lightText">Social Handles:</p>
            <div className="flex text-4xl gap-4 mt-2">
              {ownerData?.githubUrl && (
                <Link
                  aria-label="Redirect to github social handler"
                  href={ownerData?.githubUrl}
                  target="_blank"
                >
                  <FaGithub className="rounded-full border-2 border-ternaryText text-lightText" />
                </Link>
              )}
              {ownerData?.facebookUrl && (
                <Link
                  aria-label="Redirect to facebook social handler"
                  href={ownerData?.facebookUrl}
                  target="_blank"
                >
                  <FaFacebook className="rounded-full border-2 border-ternaryText text-lightText" />
                </Link>
              )}
              {ownerData?.linkedInUrl && (
                <Link
                  aria-label="Redirect to linkedin social handler"
                  href={ownerData?.linkedInUrl}
                  target="_blank"
                >
                  <FaLinkedin className="rounded-full border-2 border-ternaryText text-lightText" />
                </Link>
              )}
              {ownerData?.stackOverflowUrl && (
                <Link
                  aria-label="Redirect to stackoverflow social handler"
                  href={ownerData?.stackOverflowUrl}
                  target="_blank"
                >
                  <PiStackOverflowLogoFill className="rounded-full border-2 border-ternaryText text-lightText" />
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="rounded-sm bg-secondaryBg p-4">
          <h2 className="text-2xl font-medium text-center text-textSecondary">
            Send a message
          </h2>
          <div>
            <Form
              submitHandler={onSubmit}
              resolver={yupResolver(contactFormSchema)}
            >
              <div
                style={{
                  marginBottom: "10px",
                  marginTop: "20px",
                }}
              >
                <FormInput
                  type="text"
                  name="email"
                  label=""
                  placeholder="Email"
                  size="large"
                />
              </div>
              <div
                style={{
                  marginBottom: "10px",
                  marginTop: "20px",
                }}
              >
                <FormInput
                  type="text"
                  name="name"
                  label=""
                  placeholder="Name"
                  size="large"
                />
              </div>
              <div
                style={{
                  marginBottom: "10px",
                  marginTop: "20px",
                }}
              >
                <FormTextInput
                  name="message"
                  label=""
                  placeholder="Enter your message here"
                  size="large"
                />
              </div>
              <div>
                <CommonButton
                  content="Send"
                  type="submit"
                  classNames="w-full text-base mt-5 py-2"
                />
              </div>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetInTouch;
